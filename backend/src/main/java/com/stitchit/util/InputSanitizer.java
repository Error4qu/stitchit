package com.stitchit.util;

import java.util.regex.Pattern;

/**
 * Sanitizes free-text user input before persistence. Strips HTML tags and
 * control characters so stored values are safe to render in any frontend
 * without relying on client-side escaping.
 */
public final class InputSanitizer {

    private static final Pattern HTML_TAGS = Pattern.compile("<[^>]*>");
    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\p{Cntrl}&&[^\r\n\t]]");

    private InputSanitizer() {}

    public static String sanitize(String input) {
        if (input == null) return null;
        String cleaned = HTML_TAGS.matcher(input).replaceAll("");
        cleaned = CONTROL_CHARS.matcher(cleaned).replaceAll("");
        return cleaned.trim();
    }
}
