package com.slpolice.monolith.controller;

import com.slpolice.monolith.dto.FineCategoryRequest;
import com.slpolice.monolith.dto.OfficerRequest;
import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.Officer;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ─── Statistics ───────────────────────────────────────────────────────────

    /**
     * GET /api/admin/stats/overview
     * Returns total fines paid (not issued), total collections, and pending fine count.
     */
    @GetMapping("/stats/overview")
    public ResponseEntity<?> getOverviewStats() {
        try {
            Map<String, Object> stats = adminService.getOverviewStats();
            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            log.error("Error fetching overview stats", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch overview stats\"}");
        }
    }

    /**
     * GET /api/admin/stats/district
     * Returns total collections grouped by district.
     */
    @GetMapping("/stats/district")
    public ResponseEntity<?> getDistrictStats() {
        try {
            List<Map<String, Object>> stats = adminService.getDistrictStats();
            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            log.error("Error fetching district stats", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch district stats\"}");
        }
    }

    /**
     * GET /api/admin/stats/category
     * Returns total collections grouped by fine category.
     */
    @GetMapping("/stats/category")
    public ResponseEntity<?> getCategoryStats() {
        try {
            List<Map<String, Object>> stats = adminService.getCategoryStats();
            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            log.error("Error fetching category stats", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch category stats\"}");
        }
    }

    // ─── Fines Management ─────────────────────────────────────────────────────

    /**
     * GET /api/admin/fines?page=0&size=20&status=PAID
     * Returns a paginated list of all traffic fines.
     */
    @GetMapping("/fines")
    public ResponseEntity<?> getAllFines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        try {
            Page<TrafficFine> fines = adminService.getAllFines(page, size, status);
            return ResponseEntity.ok(fines);
        } catch (Exception ex) {
            log.error("Error fetching fines list", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch fines\"}");
        }
    }

    /**
     * GET /api/admin/fines/{id}
     * Returns detailed information for a specific fine.
     */
    @GetMapping("/fines/{id}")
    public ResponseEntity<?> getFineById(@PathVariable Long id) {
        try {
            TrafficFine fine = adminService.getFineById(id);
            return ResponseEntity.ok(fine);
        } catch (IllegalArgumentException ex) {
            log.warn("Fine not found: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"" + ex.getMessage() + "\"}");
        } catch (Exception ex) {
            log.error("Error fetching fine by ID", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch fine\"}");
        }
    }

    // ─── Officers Management ──────────────────────────────────────────────────

    /**
     * GET /api/admin/officers
     * Returns a list of all registered traffic police officers.
     */
    @GetMapping("/officers")
    public ResponseEntity<?> getAllOfficers() {
        try {
            List<Officer> officers = adminService.getAllOfficers();
            return ResponseEntity.ok(officers);
        } catch (Exception ex) {
            log.error("Error fetching officers", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch officers\"}");
        }
    }

    /**
     * POST /api/admin/officers
     * Creates a new traffic police officer.
     */
    @PostMapping("/officers")
    public ResponseEntity<?> createOfficer(@RequestBody OfficerRequest request) {
        try {
            Officer officer = adminService.createOfficer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(officer);
        } catch (Exception ex) {
            log.error("Error creating officer", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to create officer\"}");
        }
    }

    // ─── Fine Categories Management ───────────────────────────────────────────

    /**
     * GET /api/admin/categories
     * Returns a list of all fine categories.
     */
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<FineCategory> categories = adminService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception ex) {
            log.error("Error fetching categories", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to fetch categories\"}");
        }
    }

    /**
     * POST /api/admin/categories
     * Creates a new fine category.
     */
    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody FineCategoryRequest request) {
        try {
            FineCategory category = adminService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(category);
        } catch (Exception ex) {
            log.error("Error creating category", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to create category\"}");
        }
    }
}
