package com.impsswitch.plugin;

import org.springframework.stereotype.Component;

@Component
public class BankAPlugin implements BankPlugin {

    @Override
    public String getBankCode() {
        return "BANKA";
    }

    @Override
    public String processTransaction(
            String transactionReference,
            String amount) {

        // Simulate BANKA-specific transaction processing.
        return "BANKA plugin processed transaction "
                + transactionReference
                + " for amount "
                + amount;
    }
}