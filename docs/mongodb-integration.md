# MongoDB Integration

This project includes MongoDB integration to log all emails sent through the AskWajdi form.

## Setup

1. **Install Dependencies**
   ```bash
   bun install mongodb
   ```

2. **Environment Variables**
   Add the following to your `.env.local` file:
   ```
   MONGO_URI=your_mongodb_connection_string_here
   ```

   For MongoDB Atlas:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
   ```

   For local MongoDB:
   ```
   MONGO_URI=mongodb://localhost:27017
   ```

## Database Structure

- **Database**: `main`
- **Collection**: `emails`

### Email Log Schema

```typescript
interface EmailLog {
  _id?: ObjectId
  senderEmail: string
  senderName?: string
  question: string
  emailContent: {
    html: string
    text: string
  }
  resendEmailId?: string
  timestamp: Date
  status: 'sent' | 'failed'
  errorMessage?: string
}
```

## Features

### Connection Pooling
- Optimized for Next.js with proper connection pooling
- Reuses connections in development mode
- Configurable pool size (default: 10 connections)
- Automatic timeout handling

### Email Logging
- Logs all successful emails with full content
- Logs failed emails with error messages
- Includes Resend email ID for tracking
- Timestamps for audit trail

### Utility Functions
- `getAllEmails(limit)` - Get recent emails
- `getEmailsByStatus(status)` - Filter by sent/failed
- `getEmailsBySender(email)` - Get emails from specific sender
- `getEmailStats()` - Get email statistics

### Database Indexes
The system automatically creates indexes for:
- `senderEmail`
- `status`
- `timestamp`
- `resendEmailId`
- Compound index on `senderEmail` + `timestamp`

## API Endpoints

### Get Email Logs
```
GET /api/emails?limit=10
```

### Get Email Statistics
```
GET /api/emails?stats=true
```

## Error Handling

The system handles:
- MongoDB connection errors
- Failed email logging (logs to console)
- Graceful degradation if MongoDB is unavailable

## Development

To run database operations:
```bash
# View recent emails
curl "http://localhost:3000/api/emails?limit=5"

# Get statistics
curl "http://localhost:3000/api/emails?stats=true"
```
