package com.stitchit.config;

import com.stitchit.payment.MockPaymentProvider;
import com.stitchit.payment.PaymentProvider;
import com.stitchit.payment.RazorpayPaymentProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Selects the payment gateway by the {@code payment.provider} property:
 * "razorpay" for real payments (requires RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET),
 * anything else falls back to the mock provider for dev.
 */
@Configuration
public class PaymentConfig {

    private static final Logger log = LoggerFactory.getLogger(PaymentConfig.class);

    @Bean
    public PaymentProvider paymentProvider(
            @Value("${payment.provider:mock}") String provider,
            @Value("${razorpay.key-id:}") String keyId,
            @Value("${razorpay.key-secret:}") String keySecret) {
        if ("razorpay".equalsIgnoreCase(provider)) {
            if (keyId.isBlank() || keySecret.isBlank()) {
                throw new IllegalStateException(
                        "payment.provider=razorpay requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
            }
            log.info("PAYMENT_PROVIDER=RAZORPAY");
            return new RazorpayPaymentProvider(keyId, keySecret);
        }
        log.warn("PAYMENT_PROVIDER=MOCK — all payments auto-succeed; do not use in production");
        return new MockPaymentProvider();
    }
}
