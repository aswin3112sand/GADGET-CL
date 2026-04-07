package com.ecommerce.controller;

import com.ecommerce.dto.OrderResponse;
import com.ecommerce.dto.PaymentVerificationResponse;
import com.ecommerce.dto.VerifyPaymentRequest;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<PaymentVerificationResponse> createVerifiedOrder(@Valid @RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(orderService.verifyPayment(request));
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderResponse>> getAdminOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
