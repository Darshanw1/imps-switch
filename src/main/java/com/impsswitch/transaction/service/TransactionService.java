
package com.impsswitch.transaction.service;

import com.impsswitch.integration.cbs.CbsAdapter;
import com.impsswitch.integration.npci.NpciAdapter;
import com.impsswitch.messaging.iso8583.Iso8583Message;
import com.impsswitch.messaging.iso8583.Iso8583MessageFactory;
import com.impsswitch.messaging.iso8583.Iso8583Parser;
import com.impsswitch.plugin.BankPlugin;
import com.impsswitch.plugin.PluginRegistry;
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

    // Dependencies injected automatically by Lombok.
    private final TransactionRouter transactionRouter;
    private final CbsAdapter cbsAdapter;
    private final NpciAdapter npciAdapter;
    private final Iso8583MessageFactory messageFactory;
    private final Iso8583Parser iso8583Parser;
    private final TransactionRepository transactionRepository;
    private final PluginRegistry pluginRegistry;

    // Main method for processing inward and outward transactions.
    public TransactionResponse processTransaction(
            TransactionRequest request) {

        // Step 1: Generate a unique transaction reference.
        String reference = "IMPS-" + UUID.randomUUID();

        // Step 2: Create a transaction with RECEIVED status.
        Transaction transaction = Transaction.builder()
                .transactionReference(reference)
                .senderBankCode(request.senderBankCode())
                .receiverBankCode(request.receiverBankCode())
                .amount(request.amount())
                .transactionType(request.transactionType())
                .status(TransactionStatus.RECEIVED)
                .build();

        // Save transaction before starting processing.
        transactionRepository.save(transaction);

        try {

            // Step 3: Create the simplified ISO 8583 message.
            Iso8583Message message =
                    messageFactory.createMessage(request, reference);

            // Validate the message before processing.
            iso8583Parser.validateMessage(message);

            // Step 4: Route the transaction to the receiver bank.
            String destination = transactionRouter.routeToBank(
                    request.receiverBankCode()
            );

            transaction.updateStatus(TransactionStatus.ROUTED);
            transactionRepository.save(transaction);

            // Step 5: Find the receiver bank's plugin.
            BankPlugin bankPlugin = pluginRegistry.getPlugin(
                    request.receiverBankCode()
            );

            // Execute the selected bank's simulated processing logic.
            String pluginResult = bankPlugin.processTransaction(
                    reference,
                    request.amount().toPlainString()
            );

            // Step 6: Simulate CBS integration.
            String cbsResult = cbsAdapter.submitTransaction(
                    reference,
                    request.receiverBankCode(),
                    request.amount().toPlainString()
            );

            // Step 7: Simulate NPCI integration.
            String npciResult = npciAdapter.submitTransaction(
                    reference,
                    request.senderBankCode(),
                    request.receiverBankCode(),
                    request.amount().toPlainString()
            );

            // Step 8: Mark simulated processing as successful.
            transaction.updateStatus(TransactionStatus.SUCCESS);
            transactionRepository.save(transaction);

            // Step 9: Return the transaction response.
            return new TransactionResponse(
                    reference,
                    request.transactionType(),
                    request.amount(),
                    transaction.getStatus().name(),
                    "Transaction processed successfully. "
                            + "Destination: " + destination
                            + " | " + pluginResult
                            + " | " + cbsResult
                            + " | " + npciResult
            );

        } catch (RuntimeException exception) {

            // Mark the transaction as failed if processing throws an error.
            transaction.updateStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);

            // Return the failure details.
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
