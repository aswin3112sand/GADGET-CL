package com.ecommerce.repository;

import com.ecommerce.entity.CustomerOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    Optional<CustomerOrder> findByRazorpayPaymentId(String razorpayPaymentId);

    Optional<CustomerOrder> findByRazorpayOrderId(String razorpayOrderId);

    @EntityGraph(attributePaths = {"items", "items.product"})
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();
}
