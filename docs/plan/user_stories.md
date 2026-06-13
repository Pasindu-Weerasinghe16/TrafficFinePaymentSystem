# User Stories & System Flow

To visualize how the system works in the real world with the logic gaps closed, here are the core user journeys from end-to-end.

---

## Story 1: On-the-Spot Payment (Mobile App)
**Actor:** Driver & Traffic Police Officer  
**Scenario:** A driver is pulled over for speeding.

1. **The Incident:** The Police Officer writes out a paper traffic fine ticket. The ticket contains a unique Reference Number, the Category ID for "Speeding", and the Officer's Badge Number.
2. **App Interaction:** The driver does not want their license confiscated, so they open the official Android Mobile App immediately.
3. **Validation:** The driver types in the Reference Number, Category ID, Officer Badge Number, and their current Location. The app securely checks the backend, which confirms the fine amount for "Speeding" is Rs. 1500 and that it hasn't been paid yet.
4. **Payment:** The driver enters their payment details and hits pay.
5. **System Action:** The backend successfully processes the money, permanently saves the fine record into the database as "PAID", and instantly fires an SMS to the Police Officer.
6. **Resolution:** The Officer's phone buzzes with the SMS: *"Reference #12345 has been successfully paid."* The officer lets the driver go with their license.

---

## Story 2: Pay Later (Web Portal)
**Actor:** Driver  
**Scenario:** A driver cannot pay on the spot.

1. **The Incident:** The Police Officer issues the paper ticket (with Ref Number, Category ID, and Badge Number) and confiscates the driver's physical license as collateral.
2. **Web Interaction:** Two days later, the driver sits at their laptop and visits the official Web Portal.
3. **Validation:** They enter the details from the paper ticket into the web form. The system pulls up the required fine amount.
4. **Payment:** The driver successfully pays the fine online.
5. **System Action:** The backend logs the payment and automatically sends an SMS to the specific Officer who originally confiscated the license.
6. **Resolution:** The driver goes to the local police station. The Officer already knows the fine is paid because of the SMS, and hands the driver their license back.

---

## Story 3: Nationwide Monitoring (Admin Portal)
**Actor:** Senior Police Official / Admin  
**Scenario:** Monthly review of traffic fine collections.

1. **Authentication:** The Admin visits the Admin Web Portal and logs in with their secure credentials.
2. **Overview:** The system verifies their JWT token and loads the secure Dashboard.
3. **Insights:** The Admin immediately sees the **Total Revenue Collected** nationwide.
4. **Analysis:** They look at the interactive charts and see that:
   - *Colombo District* generated the most revenue this month.
   - The *Speeding* category accounts for 65% of all paid fines.
5. **Resolution:** The Admin uses this data to decide where to deploy more traffic officers next month.
