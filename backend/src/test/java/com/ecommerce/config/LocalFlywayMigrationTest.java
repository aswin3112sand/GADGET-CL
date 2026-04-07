package com.ecommerce.config;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LocalFlywayMigrationTest {

    @Test
    void migrateShouldRepairLegacyLocalProductSchema() throws Exception {
        String databaseName = "legacy-local-" + UUID.randomUUID();
        String url = "jdbc:h2:mem:" + databaseName + ";MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE";

        try (Connection connection = DriverManager.getConnection(url, "sa", "");
             Statement statement = connection.createStatement()) {
            statement.execute("""
                    CREATE TABLE products (
                        id BIGSERIAL PRIMARY KEY,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        description TEXT NOT NULL,
                        image_url VARCHAR(1024),
                        name VARCHAR(255) NOT NULL,
                        price NUMERIC(12, 2) NOT NULL,
                        stock_quantity INTEGER NOT NULL DEFAULT 12,
                        video_url VARCHAR(1024),
                        section_id BIGINT NOT NULL,
                        sku VARCHAR(120)
                    )
                    """);
            statement.execute("""
                    INSERT INTO products (id, description, image_url, name, price, stock_quantity, video_url, section_id, sku)
                    VALUES (1, 'Legacy description', 'https://cdn.example.com/item.jpg', 'Legacy item', 499.00, 5, 'https://cdn.example.com/item.mp4', 7, '')
                    """);
        }

        Flyway.configure()
                .dataSource(url, "sa", "")
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .baselineVersion("3")
                .load()
                .migrate();

        try (Connection connection = DriverManager.getConnection(url, "sa", "");
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("""
                     SELECT brand, discount_percentage, low_stock_alert_enabled, full_description, image_urls, sku, stock_quantity
                     FROM products
                     WHERE id = 1
                     """)) {
            assertTrue(resultSet.next());
            assertEquals("Gadget69", resultSet.getString("brand"));
            assertEquals(0, resultSet.getInt("discount_percentage"));
            assertTrue(resultSet.getBoolean("low_stock_alert_enabled"));
            assertEquals("Legacy description", resultSet.getString("full_description"));
            assertEquals("[\"https://cdn.example.com/item.jpg\"]", resultSet.getString("image_urls"));
            assertEquals("G69-1", resultSet.getString("sku"));
            assertEquals(5, resultSet.getInt("stock_quantity"));
        }

        try (Connection connection = DriverManager.getConnection(url, "sa", "");
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("""
                     SELECT url, type, position
                     FROM product_media
                     WHERE product_id = 1
                     ORDER BY position
                     """)) {
            assertTrue(resultSet.next());
            assertEquals("https://cdn.example.com/item.jpg", resultSet.getString("url"));
            assertEquals("IMAGE", resultSet.getString("type"));
            assertEquals(0, resultSet.getInt("position"));
            assertTrue(resultSet.next());
            assertEquals("https://cdn.example.com/item.mp4", resultSet.getString("url"));
            assertEquals("VIDEO", resultSet.getString("type"));
            assertEquals(1, resultSet.getInt("position"));
        }
    }
}
