package com.impsswitch.integration.cbs;

public interface CbsAdapter {

    String submitTransaction(
            String transactionReference,
            String bankCode,
            String amount
    );
}