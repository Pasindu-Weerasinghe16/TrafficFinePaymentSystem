# Orchestration Plan

This document outlines the step-by-step execution timeline for all 6 developers to ensure zero merge conflicts and zero idle blocking time. It acts as the master timeline for the project manager to track dependencies.

## Simple Developer Flow

**The Sequential Backend Track:**
`[Dev 1: Postgres DB]` ➔ `[Dev 2: JPA Entities & Security]` ➔ `[Dev 3: Core APIs]` ➔ `[Dev 1: Gateway Routing]` ➔ **LIVE API READY**

**The Parallel Frontend Track:**
`[Dev 4: Android App]` ──╮
`[Dev 5: Motorist Web]` ──┼── _(Builds UI using mock data in parallel)_ ──➔ **CONNECTS TO LIVE API**
`[Dev 6: Admin Web]` ──╯

---

## Execution Timeline

```mermaid
gantt
    title Traffic Fine Payment System - Development Orchestration
    dateFormat  YYYY-MM-DD
    axisFormat %d

    section Phase 1: Foundation
    Infra: Postgres DB Setup (Dev 1)         :active, a1, 2026-06-01, 1d
    Frontend: Static UI & Mocks (Dev 4, 5, 6):active, a2, 2026-06-01, 3d
    Backend: JPA Entities & Security (Dev 2) :active, a3, after a1, 1d

    section Phase 2: Core Logic & Routing
    Backend: Core Logic APIs (Dev 3)         :active, b1, after a3, 2d
    Infra: Gateway & Nginx Routing (Dev 1)   :active, b2, after b1, 1d

    section Phase 3: Integration
    Frontend: Live API Integration (Dev 4, 5, 6) :active, c1, after b2, 2d
    Backend: Bug Fixes & Support (Dev 2, 3)  :active, c2, after b2, 2d
```

## Milestone Orchestration Checklist

### Milestone 1: The Database is Up

- [ ] Dev 1 spins up Postgres Docker container.
- [ ] **Action:** Dev 2 is officially unblocked.

### Milestone 2: The Data Layer is Complete

- [ ] Dev 2 pushes JPA Entities and Security config to `main`.
- [ ] **Action:** Dev 3 is officially unblocked to start business logic.
- [ ] **Action:** Dev 6 is officially unblocked to test JWT Admin Login.

### Milestone 3: The APIs are Ready

- [ ] Dev 3 pushes the REST Controllers and Services to `main`.
- [ ] **Action:** Dev 1 is officially unblocked to configure Gateway routing rules.

### Milestone 4: The Gateway is Live

- [ ] Dev 1 successfully tests routing from localhost to the monolith.
- [ ] **Action:** Dev 4, 5, and 6 are officially unblocked to delete their JSON mocks and point their UI forms to the live Gateway.

### Milestone 5: Full Integration & Handover

- [ ] Frontends test end-to-end flows against live data.
- [ ] Backend team resolves any CORS or JSON payload mismatch issues.
- [ ] Final merge to `master/main` branch.
