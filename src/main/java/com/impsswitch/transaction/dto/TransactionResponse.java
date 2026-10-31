package com.impsswitch.transaction.dto;

import com.impsswitch.transaction.model.TransactionType;

import java.math.BigDecimal;

public record TransactionResponse(

        String transactionReference,

        TransactionType transactionType,

        BigDecimal amount,

        String status,

        String message
) {
}
