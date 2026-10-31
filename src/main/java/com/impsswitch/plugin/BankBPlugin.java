package com.impsswitch.plugin;

import org.springframework.stereotype.Component;

@Component
public class BankBPlugin implements BankPlugin {

    @Override
    public String getBankCode() {
        return "BANKB";
    }

    @Override
    public String processTransaction(
            String transactionReference,
            String amount) {

        // Simulate BANKB-specific transaction processing.
        return "BANKB plugin processed transaction "
                + transactionReference
                + " for amount "
                + amount;
    }
}