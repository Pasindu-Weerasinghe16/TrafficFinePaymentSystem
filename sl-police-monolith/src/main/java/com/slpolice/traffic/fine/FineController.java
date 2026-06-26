package com.slpolice.traffic.fine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FineController {
    private final FineService fineService;

    @GetMapping("/fines")
    public List<TrafficFine> getAll() { return fineService.getAll(); }

    @PostMapping("/fines")
    public TrafficFine create(@RequestBody FineRequest req, Authentication auth) {
        return fineService.create(req, auth.getName());
    }

    @GetMapping("/fines/{id}")
    public TrafficFine getById(@PathVariable Long id) { return fineService.getById(id); }

    @GetMapping("/fines/vehicle/{vehicleNumber}")
    public List<TrafficFine> getByVehicle(@PathVariable String vehicleNumber) {
        return fineService.getByVehicle(vehicleNumber);
    }

    @PutMapping("/fines/{id}/cancel")
    public TrafficFine cancel(@PathVariable Long id) { return fineService.cancel(id); }

    @PutMapping("/fines/{id}/pay")
    public TrafficFine markPaid(@PathVariable Long id) { return fineService.markPaid(id); }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Object> stats() { return ResponseEntity.ok(fineService.getStats()); }
}
