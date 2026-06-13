# Functional Requirements

## 1. User Roles
- **Driver**: Can view fine details and make payments.
- **Traffic Police Officer**: Receives SMS notifications when a driver completes a payment.
- **Admin**: Can view nationwide traffic fine collections and insights.

## 2. Core Features

### 2.1 Fine Payment (Driver)
- **Mobile Application**: Allows drivers to pay traffic fines on-the-spot by entering the unique fine reference number, traffic fine category identifier, and the officer's badge number.
- **Web Portal**: Allows drivers to pay traffic fines later using the same details.
- **Location Tracking**: The system records the exact location where the traffic violation occurred.

### 2.2 Payment Notification
- **SMS Alert**: System automatically sends an SMS to the issuing traffic police officer upon successful payment confirmation.

### 2.3 Admin Monitoring (Admin Web Portal)
- **Dashboard**: Monitor traffic fine collections nationwide.
- **Insights**: View district-wise total collections.
- **Breakdown**: View collection breakdowns by fine categories.

### 2.4 Security & Authentication
- **Authentication**: JWT token-based authentication for administrative and secure access points.
