package com.stitchit.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Dev/test stand-in for a real gateway: no external calls, every payment
 * succeeds. Lets the booking-to-paid flow run end-to-end without a Razorpay
 * account. Never enable in production.
 */
public class MockPaymentProvider implements PaymentProvider {

    private static final Logger log = LoggerFactory.getLogger(MockPaymentProvider.class);

    @Override
    public String name() {
        return "MOCK";
    }

    @Override
    public String publicKeyId() {
        return "";
    }

    @Override
    public String createProviderOrder(BigDecimal amount, String currency, String receipt) {
        String orderId = "mock_order_" + UUID.randomUUID().toString().replace("-", "");
        log.info("PAYMENT_ORDER_CREATED provider=MOCK orderId={} amount={} receipt={}",
                orderId, amount, receipt);
        return orderId;
    }

    @Override
    public boolean verifySignature(String providerOrderId, String providerPaymentId, String signature) {
        return true;
    }
}
