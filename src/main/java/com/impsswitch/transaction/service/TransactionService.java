package com.impsswitch.transaction.service;

import com.impsswitch.integration.cbs.CbsAdapter;
import com.impsswitch.integration.npci.NpciAdapter;
import com.impsswitch.messaging.iso8583.Iso8583Message;
import com.impsswitch.messaging.iso8583.Iso8583MessageFactory;
import com.impsswitch.messaging.iso8583.Iso8583Parser;
import com.impsswitch.routing.TransactionRouter;
import com.impsswitch.transaction.dto.TransactionRequest;
import com.impsswitch.transaction.dto.TransactionResponse;
import com.impsswitch.transaction.model.Transaction;
import com.impsswitch.transaction.model.TransactionStatus;
import com.impsswitch.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    // Dependencies injected automatically by Lombok constructor.
    private final TransactionRouter transactionRouter;
    private final CbsAdapter cbsAdapter;
    private final NpciAdapter npciAdapter;
    private final Iso8583MessageFactory messageFactory;
    private final Iso8583Parser iso8583Parser;
    private final TransactionRepository transactionRepository;

    public TransactionResponse processTransaction(
            TransactionRequest request) {

        // Generate a unique transaction reference.
        String reference = "IMPS-" + UUID.randomUUID();

        // Create transaction with initial RECEIVED status.
        Transaction transaction = Transaction.builder()
                .transactionReference(reference)
                .senderBankCode(request.senderBankCode())
                .receiverBankCode(request.receiverBankCode())
                .amount(request.amount())
                .transactionType(request.transactionType())
                .status(TransactionStatus.RECEIVED)
                .build();

        // Save transaction before processing.
        transactionRepository.save(transaction);

        try {
            // Step 1: Create and validate ISO 8583 message.
            Iso8583Message message =
                    messageFactory.createMessage(request, reference);

            iso8583Parser.validateMessage(message);

            // Step 2: Route transaction to destination bank.
            transactionRouter.routeToBank(
                    request.receiverBankCode()
            );

            transaction.updateStatus(TransactionStatus.ROUTED);
            transactionRepository.save(transaction);

            // Step 3: Simulate CBS integration.
            cbsAdapter.submitTransaction(
                    reference,
                    request.receiverBankCode(),
                    request.amount().toPlainString()
            );

            // Step 4: Simulate NPCI integration.
            npciAdapter.submitTransaction(
                    reference,
                    request.senderBankCode(),
                    request.receiverBankCode(),
                    request.amount().toPlainString()
            );

            // Step 5: Mark successful simulated processing.
            transaction.updateStatus(TransactionStatus.SUCCESS);
            transactionRepository.save(transaction);

            return new TransactionResponse(
                    reference,
                    request.transactionType(),
                    request.amount(),
                    transaction.getStatus().name(),
                    "Simulated transaction processing completed"
            );

        } catch (RuntimeException exception) {

            // Mark transaction as failed if processing throws an exception.
            transaction.updateStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);

            return new TransactionResponse(
                    reference,
                    request.transactionType(),
                    request.amount(),
                    transaction.getStatus().name(),
                    "Transaction processing failed: "
                            + exception.getMessage()
            );
        }
    }
}