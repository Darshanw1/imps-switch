package com.impsswitch.routing;

import org.springframework.stereotype.Component;

import java.util.Map;

// Registers this router as a Spring-managed component.
@Component
public class TransactionRouter {

    // Maps bank codes to their simulated destinations.
    private final Map<String, String> bankRoutes = Map.of(
            "BANKA", "SIMULATED_BANK_A",
            "BANKB", "SIMULATED_BANK_B"
    );

    // Finds the destination configured for a bank code.
    public String routeToBank(String bankCode) {

        // Look up the bank code in our routing map.
        String destination = bankRoutes.get(
                bankCode.toUpperCase()
        );

        // Reject the request if no route is configured.
        if (destination == null) {
            throw new IllegalArgumentException(
                    "No route configured for bank: " + bankCode
            );
        }

        // Return the destination selected by the router.
        return destination;
    }
}