package com.impsswitch.transaction.controller;

import com.impsswitch.transaction.dto.TransactionRequest;
import com.impsswitch.transaction.dto.TransactionResponse;
import com.impsswitch.transaction.service.TransactionService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transactions")
@AllArgsConstructor
public class TransactionController {

    private final TransactionService impsTransactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> processTransaction(
            @Valid @RequestBody TransactionRequest request) {

        // Call the service using the injected object.
        TransactionResponse response =
                impsTransactionService.processTransaction(request);

        // Return HTTP 202 Accepted with the response body.
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(response);
    }
}