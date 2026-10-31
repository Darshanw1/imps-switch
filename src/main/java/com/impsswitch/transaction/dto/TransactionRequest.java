package com.impsswitch.transaction.dto;

import com.impsswitch.transaction.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;


public record TransactionRequest(


        @NotBlank(message = "Sender bank code is required")
        @Size(max = 20)
        String senderBankCode,


        @NotBlank(message = "Receiver bank code is required")
        @Size(max = 20)
        String receiverBankCode,


        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01",
                message = "Amount must be greater than zero")
        BigDecimal amount,


        @NotNull(message = "Transaction type is required")
        TransactionType transactionType

) {}