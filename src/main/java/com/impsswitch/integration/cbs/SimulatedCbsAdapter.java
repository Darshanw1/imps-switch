package com.impsswitch.integration.cbs;

import org.springframework.stereotype.Component;

@Component
public class SimulatedCbsAdapter implements CbsAdapter {

    @Override
    public String submitTransaction(
            String transactionReference,
            String bankCode,
            String amount) {

        return "CBS accepted simulated request for "
                + transactionReference
                + " at bank "
                + bankCode
                + " for amount "
                + amount;

    }

}
