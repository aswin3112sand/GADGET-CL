package db.migration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

public class V6__BackfillProductMedia extends BaseJavaMigration {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void migrate(Context context) throws Exception {
        Connection connection = context.getConnection();

        try (PreparedStatement productsStatement = connection.prepareStatement("""
                SELECT id, image_url, image_urls, video_url
                FROM products
                ORDER BY id
                """);
             PreparedStatement hasMediaStatement = connection.prepareStatement("""
                     SELECT COUNT(*)
                     FROM product_media
                     WHERE product_id = ?
                     """);
             PreparedStatement insertStatement = connection.prepareStatement("""
                     INSERT INTO product_media (product_id, url, type, position)
                     VALUES (?, ?, ?, ?)
                     """);
             ResultSet products = productsStatement.executeQuery()) {

            while (products.next()) {
                long productId = products.getLong("id");
                if (hasExistingMedia(hasMediaStatement, productId)) {
                    continue;
                }

                List<LegacyMediaItem> mediaItems = collectLegacyMedia(
                        products.getString("image_url"),
                        products.getString("image_urls"),
                        products.getString("video_url")
                );

                for (int index = 0; index < mediaItems.size(); index++) {
                    LegacyMediaItem mediaItem = mediaItems.get(index);
                    insertStatement.setLong(1, productId);
                    insertStatement.setString(2, mediaItem.url());
                    insertStatement.setString(3, mediaItem.type());
                    insertStatement.setInt(4, index);
                    insertStatement.addBatch();
                }
            }

            insertStatement.executeBatch();
        }
    }

    private boolean hasExistingMedia(PreparedStatement statement, long productId) throws Exception {
        statement.setLong(1, productId);
        try (ResultSet resultSet = statement.executeQuery()) {
            return resultSet.next() && resultSet.getLong(1) > 0;
        }
    }

    private List<LegacyMediaItem> collectLegacyMedia(String imageUrl, String imageUrlsJson, String videoUrl) {
        List<LegacyMediaItem> mediaItems = new ArrayList<>();

        for (String url : parseImageUrls(imageUrl, imageUrlsJson)) {
            mediaItems.add(new LegacyMediaItem(url, "IMAGE"));
        }

        String normalizedVideo = normalize(videoUrl);
        if (normalizedVideo != null) {
            mediaItems.add(new LegacyMediaItem(normalizedVideo, "VIDEO"));
        }

        return mediaItems;
    }

    private List<String> parseImageUrls(String imageUrl, String imageUrlsJson) {
        try {
            List<String> parsedUrls = sanitize(objectMapper.readValue(blankToEmpty(imageUrlsJson), STRING_LIST));
            if (!parsedUrls.isEmpty()) {
                return parsedUrls;
            }
        } catch (Exception ignored) {
            // Fall back to the single image column when JSON parsing fails.
        }

        String normalizedImage = normalize(imageUrl);
        return normalizedImage == null ? List.of() : List.of(normalizedImage);
    }

    private List<String> sanitize(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }

        return new ArrayList<>(new LinkedHashSet<>(values.stream()
                .map(this::normalize)
                .filter(value -> value != null && !value.isBlank())
                .toList()));
    }

    private String blankToEmpty(String value) {
        return value == null || value.isBlank() ? "[]" : value;
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private record LegacyMediaItem(String url, String type) {
    }
}
