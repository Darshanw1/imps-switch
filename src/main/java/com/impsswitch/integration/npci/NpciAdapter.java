package com.impsswitch.integration.npci;

public interface NpciAdapter {

    String submitTransaction(
            String transactionReference,
            String senderBankCode,
            String receiverBankCode,
            String amount
    );
}