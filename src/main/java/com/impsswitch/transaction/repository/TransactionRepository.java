package com.impsswitch.transaction.repository;

import com.impsswitch.transaction.model.Transaction;
import org.springframework.beans.factory.support.ManagedProperties;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class TransactionRepository {

    private final Map<String, Transaction> transactions =
            new ConcurrentHashMap<>();

    public Transaction save(Transaction transaction) {

        transactions.put(
                transaction.getTransactionReference(),
                transaction
        );

        return transaction;
    }

    public Optional<Transaction> findByReference(String reference) {

        return Optional.ofNullable(transactions.get(reference));
    }

    public List<Transaction> findAll() {
        return List.copyOf(transactions.values());
    }
}
