package com.impsswitch.messaging.iso8583;

import com.impsswitch.transaction.dto.TransactionRequest;
import com.impsswitch.transaction.model.TransactionType;
import org.springframework.stereotype.Component;

import javax.sql.rowset.serial.SerialStruct;
import java.util.HashMap;
import java.util.Map;

@Component
public class Iso8583MessageFactory {

    public Iso8583Message createMessage(
            TransactionRequest request,
            String transactionReference) {

        Map<Integer, String> fields = new HashMap<>();

        fields.put(3, "000000");

        long amountInPaise = request.amount()
                .movePointRight(2)
                .longValueExact();

        fields.put(4, String.format("%012d", amountInPaise));

        fields.put(11, transactionReference);

        fields.put(100, request.senderBankCode());
        fields.put(102, request.receiverBankCode());

        String mti;

        if (request.transactionType() == TransactionType.OUTWARD) {
            mti = "0200";
        } else {
            mti = "0100";
        }

        return new Iso8583Message(
                mti,
                Map.copyOf(fields)
        );
    }
}
