package com.ecommerce.service;

import com.ecommerce.config.RazorpayProperties;
import com.ecommerce.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayGatewayService {

    private final RazorpayProperties razorpayProperties;
    private final RestClient.Builder restClientBuilder;

    public boolean isConfigured() {
        return StringUtils.hasText(razorpayProperties.keyId())
                && StringUtils.hasText(razorpayProperties.keySecret())
                && StringUtils.hasText(razorpayProperties.apiBaseUrl());
    }

    public RazorpayOrderResult createOrder(long amountInPaise, String receipt, Map<String, String> notes) {
        validateConfiguration();
        try {
            RestClient restClient = restClientBuilder
                    .baseUrl(razorpayProperties.apiBaseUrl())
                    .defaultHeaders(headers -> headers.setBasicAuth(razorpayProperties.keyId(), razorpayProperties.keySecret()))
                    .build();

            Map<String, Object> request = new HashMap<>();
            request.put("amount", amountInPaise);
            request.put("currency", razorpayProperties.currency());
            request.put("receipt", receipt);
            request.put("notes", notes);

            RazorpayOrderResult response = restClient.post()
                    .uri("/orders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(RazorpayOrderResult.class);

            if (response == null || response.id() == null) {
                throw new BadRequestException("Razorpay order creation returned an invalid response");
            }
            return response;
        } catch (RestClientException exception) {
            log.error("Razorpay create order failed", exception);
            throw new BadRequestException("Unable to create Razorpay order");
        }
    }

    public void verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        validateConfiguration();
        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayProperties.keySecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] actualBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            byte[] expectedBytes = hexToBytes(razorpaySignature);
            if (!MessageDigest.isEqual(actualBytes, expectedBytes)) {
                throw new BadRequestException("Invalid Razorpay payment signature");
            }
        } catch (BadRequestException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Razorpay signature verification failed", exception);
            throw new BadRequestException("Unable to verify Razorpay payment signature");
        }
    }

    private byte[] hexToBytes(String value) {
        if (value == null || value.length() % 2 != 0) {
            throw new BadRequestException("Invalid Razorpay signature format");
        }
        byte[] bytes = new byte[value.length() / 2];
        for (int index = 0; index < value.length(); index += 2) {
            bytes[index / 2] = (byte) Integer.parseInt(value.substring(index, index + 2), 16);
        }
        return bytes;
    }

    private void validateConfiguration() {
        if (!isConfigured()) {
            throw new BadRequestException("Razorpay is not configured on the backend");
        }
    }
}
