package com.impsswitch.reconciliation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Represents a calculated settlement summary.
public record SettlementRecord(
        String settlementReference,
        int totalTransactions,
        BigDecimal totalAmount,
        LocalDateTime createdAt,
        String status
) {
}