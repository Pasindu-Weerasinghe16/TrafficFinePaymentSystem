# SL Police Mobile App

React Native/Expo Android app for the documented on-the-spot driver payment flow.

## Stable Versions

- Node.js: `24.16.0`
- React: `19.2.7`
- React Native: `0.86.0`

## What It Does

1. Validates a fine using its reference number, numeric category ID, and officer badge number.
2. Shows the fine category and amount returned by the backend.
3. Submits the violation location and card details to the payment endpoint.
4. Shows the backend receipt number after a successful payment.

## API Address

The app calls the public NGINX endpoint from `docker-compose.yml` on port `8088`.

- Android emulator default: `http://10.0.2.2:8088`
- iOS simulator/web default: `http://localhost:8088`
- Physical Android phone: set `EXPO_PUBLIC_API_URL` to this computer's LAN address before starting Expo. The phone and computer must be on the same network.

PowerShell example for a physical phone:

```powershell
$env:EXPO_PUBLIC_API_URL="http://192.168.1.10:8088"
npm run start
```

Replace `192.168.1.10` with the computer's actual IPv4 address.

## Start Up

- Container start: `node server.js`
- Mobile app: `npm run start`, then open it in an Android emulator or Expo Go.
- Android emulator: `npm run android`

The Docker mobile container is only a status endpoint on port `8082`; the interactive app runs through Expo on an emulator or phone.

## Structure

- `src/core` - API clients and shared mobile utilities
- `src/driver_views` - driver-facing screens
