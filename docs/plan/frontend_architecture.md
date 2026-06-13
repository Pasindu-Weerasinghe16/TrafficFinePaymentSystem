# Frontend Components Architecture

The frontend consists of three distinct client applications. All connect to the single Backend REST API.

## 1. Android Mobile Application (On-the-spot Payment)
- **Framework**: Native Android (Kotlin/Java) or cross-platform (Flutter / React Native) targeting Android.
- **Key Screens**:
  - `Home / Search Screen`: Input for fine reference number, category identifier, and officer badge number.
  - `Fine Details Screen`: Displays fine amount and details.
  - `Payment Screen`: Interface to securely pay the fine.
  - `Success Screen`: Payment confirmation and receipt.

## 2. Driver Web Portal (Online Payment)
- **Framework**: React.js or Vue.js (Single Page Application)
- **Key Components**:
  - `SearchFineForm`: Component for entering the fine reference number, category identifier, and officer badge number.
  - `FineDetailsCard`: Shows the fine information.
  - `CheckoutComponent`: Handles the payment processing UI.
  - `PaymentConfirmation`: Displays success message.

## 3. Admin Web Portal (Monitoring Dashboard)
- **Framework**: React.js or Vue.js (Single Page Application)
- **Key Components**:
  - `Login`: JWT-based authentication screen.
  - `DashboardLayout`: Main wrapper with navigation sidebar.
  - `OverviewWidgets`: High-level metrics (Total collected, Total number of fines paid).
  - `DistrictStatsChart`: Bar chart or map showing collections by district.
  - `CategoryBreakdownChart`: Pie chart showing revenue split by fine categories.
