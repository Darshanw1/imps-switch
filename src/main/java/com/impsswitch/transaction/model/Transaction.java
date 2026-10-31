package com.impsswitch.transaction.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class Transaction {

    private String transactionReference;
    private String senderBankCode;
    private String receiverBankCode;
    private BigDecimal amount;

    private TransactionType transactionType;
    private TransactionStatus status;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Updates transaction status and modification time.
    public void updateStatus(TransactionStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
}