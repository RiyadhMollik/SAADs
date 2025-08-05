# Farmer Data Backend API

This is the backend API for the Farmer Data Management System built with Express.js, MySQL, and Sequelize.

## Features

- Create blank farmer data entries
- Update farmer form data
- Retrieve farmer data by farmer ID and SAAO ID
- Get all farmer data for a specific SAAO
- Delete farmer data
- Automatic database synchronization

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Create a MySQL database named `farmer_data_db` and update the database configuration in `config/database.js` or set environment variables:

```bash
# Create .env file
DB_HOST=localhost
DB_PORT=3306
DB_NAME=farmer_data_db
DB_USER=root
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
```

### 3. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on port 5000 and automatically sync the database tables.

## API Endpoints

### 1. Create Farmer Data (Blank Data)
- **POST** `/api/farmer-data`
- **Body:**
```json
{
  "farmerId": "farmer123",
  "saaoId": "saao456",
  "formData": {
    "0": { "irrigation": [], "other": {} },
    "1": { "other": {} },
    // ... other tabs
  }
}
```

### 2. Get Farmer Data
- **GET** `/api/farmer-data/:farmerId?saaoId=saao456`
- **Response:** Returns the farmer's form data

### 3. Update Farmer Data
- **PUT** `/api/farmer-data/:farmerId`
- **Body:**
```json
{
  "saaoId": "saao456",
  "formData": {
    // Updated form data
  }
}
```

### 4. Get All Farmer Data for SAAO
- **GET** `/api/farmer-data/saao/:saaoId`
- **Response:** Returns all farmer data for the specified SAAO

### 5. Delete Farmer Data
- **DELETE** `/api/farmer-data/:farmerId?saaoId=saao456`

## Database Schema

### FarmerData Table
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `farmerId` (STRING, NOT NULL) - References farmers table
- `saaoId` (STRING, NOT NULL) - References users table
- `formData` (JSON, NOT NULL) - Form data for all tabs
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Indexes
- Unique index on `(farmerId, saaoId)` to prevent duplicate entries

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## CORS Configuration

The API is configured to accept requests from `http://localhost:3000` (React app). Update the CORS configuration in `server.js` if needed.

## Health Check

- **GET** `/health` - Returns server status and timestamp 