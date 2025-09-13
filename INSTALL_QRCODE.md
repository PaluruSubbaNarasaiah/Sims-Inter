# QR Code Package Installation

To enable QR code generation functionality, install the required package:

```bash
npm install qrcode
```

or

```bash
yarn add qrcode
```

## Features Added:

1. **Dynamic QR Code Generation**: Creates payment-specific QR codes with UPI payment strings
2. **Payment Success/Error Popups**: Shows success or error messages after payment processing
3. **Real-time Payment Verification**: Simulates payment verification with success/failure scenarios
4. **Enhanced UPI Integration**: Generates scannable QR codes for mobile payment apps

## Usage:

1. Select fee terms to pay
2. Choose UPI payment method
3. Click "Generate QR Code" button
4. Scan the QR code with any UPI-enabled payment app
5. Complete payment in the app
6. System will show success/error popup
7. Enter transaction ID to complete the process

The QR code contains all payment details including amount, payee information, and transaction reference.