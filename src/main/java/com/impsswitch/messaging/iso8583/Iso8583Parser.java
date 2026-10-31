package com.impsswitch.messaging.iso8583;

import org.springframework.stereotype.Component;

@Component
public class Iso8583Parser {

    public Iso8583Message validateMessage(
            Iso8583Message message) {

        if (message.messageTypeIndicator() == null ||
                !message.messageTypeIndicator().matches("\\d{4}")) {

            throw new IllegalArgumentException(
                    "MTI must contain four digits"
            );
        }

        if (message.fields() == null ||
                message.fields().isEmpty()) {

            throw new IllegalArgumentException(
                    "ISO 8583 message fields cannot be empty"
            );
        }

        return message;
    }
}
