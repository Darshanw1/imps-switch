package com.impsswitch.messaging.iso8583;


import java.util.Map;

public record Iso8583Message(
        String messageTypeIndicator,
        Map<Integer, String> fields
) {
}
