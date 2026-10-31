package com.impsswitch.plugin;

// Common interface implemented by every supported bank plugin.
public interface BankPlugin {

    // Returns the bank code supported by this plugin.
    String getBankCode();

    // Processes a transaction using this bank's implementation.
    String processTransaction(
            String transactionReference,
            String amount
    );
}