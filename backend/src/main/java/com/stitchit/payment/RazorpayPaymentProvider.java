package com.stitchit.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;

/**
 * Razorpay integration via their Orders REST API. Amounts are sent in paise.
 * Signature verification is HMAC-SHA256 of "orderId|paymentId" with the key
 * secret, compared in constant time.
 */
public class RazorpayPaymentProvider implements PaymentProvider {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentProvider.class);

    private final String keyId;
    private final String keySecret;
    private final RestClient restClient;

    public RazorpayPaymentProvider(String keyId, String keySecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.razorpay.com/v1")
                .requestInterceptor((request, body, execution) -> {
                    String auth = java.util.Base64.getEncoder().encodeToString(
                            (keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));
                    request.getHeaders().set("Authorization", "Basic " + auth);
                    return execution.execute(request, body);
                })
                .build();
    }

    @Override
    public String name() {
        return "RAZORPAY";
    }

    @Override
    public String publicKeyId() {
        return keyId;
    }

    @Override
    @SuppressWarnings("unchecked")
    public String createProviderOrder(BigDecimal amount, String currency, String receipt) {
        long amountPaise = amount.movePointRight(2).longValueExact();
        Map<String, Object> response = restClient.post()
                .uri("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "amount", amountPaise,
                        "currency", currency,
                        "receipt", receipt
                ))
                .retrieve()
                .body(Map.class);
        if (response == null || response.get("id") == null) {
            throw new IllegalStateException("Razorpay order creation returned no id");
        }
        String orderId = response.get("id").toString();
        log.info("PAYMENT_ORDER_CREATED provider=RAZORPAY orderId={} receipt={}", orderId, receipt);
        return orderId;
    }

    @Override
    public boolean verifySignature(String providerOrderId, String providerPaymentId, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] expected = mac.doFinal(
                    (providerOrderId + "|" + providerPaymentId).getBytes(StandardCharsets.UTF_8));
            String expectedHex = HexFormat.of().formatHex(expected);
            return MessageDigest.isEqual(
                    expectedHex.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("PAYMENT_SIGNATURE_CHECK_FAILED provider=RAZORPAY", e);
            return false;
        }
    }
}
