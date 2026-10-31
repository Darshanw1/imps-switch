package com.impsswitch.reconciliation;

import com.impsswitch.transaction.model.Transaction;
import com.impsswitch.transaction.model.TransactionStatus;
import com.impsswitch.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReconciliationService {

    private final TransactionRepository transactionRepository;

    public ReconciliationService(
            TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Calculates a settlement summary from successful transactions.
    public SettlementRecord reconcileAndSettle() {

        // Get all transactions currently stored in memory.
        List<Transaction> allTransactions =
                transactionRepository.findAll();

        // Keep only transactions with SUCCESS status.
        List<Transaction> successfulTransactions =
                allTransactions.stream()
                        .filter(transaction ->
                                transaction.getStatus()
                                        == TransactionStatus.SUCCESS)
                        .toList();

        // Calculate the total successful transaction amount.
        BigDecimal totalAmount =
                successfulTransactions.stream()
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Generate a unique settlement reference.
        String settlementReference =
                "SET-" + UUID.randomUUID();

        // Create the settlement summary.
        return new SettlementRecord(
                settlementReference,
                successfulTransactions.size(),
                totalAmount,
                LocalDateTime.now(),
                "CALCULATED"
        );
    }
}