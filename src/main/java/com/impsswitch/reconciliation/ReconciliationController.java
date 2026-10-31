package com.impsswitch.reconciliation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reconciliation")
public class ReconciliationController {

    private final ReconciliationService reconciliationService;

    public ReconciliationController(
            ReconciliationService reconciliationService) {
        this.reconciliationService = reconciliationService;
    }

    // Runs the simulated reconciliation and settlement calculation.
    @PostMapping("/settlement")
    public ResponseEntity<SettlementRecord> createSettlement() {

        SettlementRecord record =
                reconciliationService.reconcileAndSettle();

        return ResponseEntity.ok(record);
    }
}