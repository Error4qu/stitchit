package com.stitchit.payment;

import java.math.BigDecimal;

/**
 * Strategy interface for payment gateways. Implementations create an order on
 * the provider side and verify the signature the provider returns after a
 * successful checkout.
 */
public interface PaymentProvider {

    /** Provider name stored on the payment row, e.g. RAZORPAY or MOCK. */
    String name();

    /** Public key id the frontend checkout widget needs (empty for mock). */
    String publicKeyId();

    /**
     * Creates an order on the provider and returns the provider's order id.
     *
     * @param amount  amount in major units (rupees)
     * @param receipt merchant-side reference, e.g. "alteration-42"
     */
    String createProviderOrder(BigDecimal amount, String currency, String receipt);

    /** Verifies the post-checkout signature. */
    boolean verifySignature(String providerOrderId, String providerPaymentId, String signature);
}
