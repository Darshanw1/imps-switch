package com.impsswitch.integration.npci;

import org.springframework.stereotype.Component;

@Component
public class SimulatedNpciAdapter implements NpciAdapter {

    @Override
    public String submitTransaction(
            String transactionReference,
            String senderBankCode,
            String receiverBankCode,
            String amount) {

        return "NPCI handoff simulated for "
                + transactionReference
                + " from " + senderBankCode
                + " to " + receiverBankCode
                + " for amount " + amount;
    }
}