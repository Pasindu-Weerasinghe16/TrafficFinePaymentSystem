package com.slpolice.traffic.fine;

import com.slpolice.traffic.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FineService {
    private final FineRepository repo;
    private final UserRepository userRepo;

    public TrafficFine create(FineRequest req, String officerUsername) {
        User officer = userRepo.findByUsername(officerUsername).orElseThrow();
        TrafficFine f = new TrafficFine();
        f.setVehicleNumber(req.getVehicleNumber().toUpperCase());
        f.setAmount(req.getAmount());
        f.setDescription(req.getDescription());
        f.setLocation(req.getLocation());
        f.setDueDate(req.getDueDate() != null ? req.getDueDate() : LocalDate.now().plusDays(30));
        f.setIssuedBy(officer);
        return repo.save(f);
    }

    public List<TrafficFine> getAll() { return repo.findAll(); }

    public TrafficFine getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Fine not found"));
    }

    public List<TrafficFine> getByVehicle(String vehicleNumber) {
        return repo.findByVehicleNumberIgnoreCase(vehicleNumber.toUpperCase());
    }

    public TrafficFine cancel(Long id) {
        TrafficFine f = getById(id);
        f.setStatus(TrafficFine.Status.CANCELLED);
        return repo.save(f);
    }

    public TrafficFine markPaid(Long id) {
        TrafficFine f = getById(id);
        f.setStatus(TrafficFine.Status.PAID);
        return repo.save(f);
    }

    public Object getStats() {
        long total = repo.count();
        long pending = repo.countByStatus(TrafficFine.Status.PENDING);
        long paid = repo.countByStatus(TrafficFine.Status.PAID);
        java.math.BigDecimal revenue = repo.totalRevenue();
        return new java.util.HashMap<String, Object>() {{
            put("total", total); put("pending", pending);
            put("paid", paid); put("revenue", revenue);
        }};
    }
}
