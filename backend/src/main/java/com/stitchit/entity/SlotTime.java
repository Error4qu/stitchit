package com.stitchit.entity;

public enum SlotTime {
    MORNING_9_11("9 AM - 11 AM"),
    AFTERNOON_12_2("12 PM - 2 PM"),
    AFTERNOON_3_5("3 PM - 5 PM"),
    EVENING_6_8("6 PM - 8 PM");

    private final String displayName;

    SlotTime(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
