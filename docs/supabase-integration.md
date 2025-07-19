# Supabase Integration

This project uses Supabase to log all emails sent through the AskWajdi form.

## Setup

1. **Install Supabase client:**
   ```bash
   bun install @supabase/supabase-js
   ```

2. **Environment Variables:**
   Add the following to your `.env` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_KEY=your_supabase_service_role_key_here
   ```

3. **Database Table:**
   The application expects a table named `Emails` with the following structure:
   ```sql
   CREATE TABLE "Emails" (
     id SERIAL PRIMARY KEY,
     senderEmail VARCHAR NOT NULL,
     senderName VARCHAR,
     question TEXT NOT NULL,
     emailContent JSON NOT NULL,
     resendEmailId VARCHAR,
     timestamp TIMESTAMPTZ DEFAULT NOW(),
     status VARCHAR NOT NULL CHECK (status IN ('sent', 'failed')),
     errorMessage TEXT
   );
   ```

## Database Schema

The `Emails` table stores:
- `id`: Auto-incrementing primary key
- `senderEmail`: Email address of the person asking the question
- `senderName`: Optional name of the sender
- `question`: The question text
- `emailContent`: JSON object containing `html` and `text` versions of the email
- `resendEmailId`: Optional ID from Resend service
- `timestamp`: When the email was processed
- `status`: Either 'sent' or 'failed'
- `errorMessage`: Error details if the email failed

## API Integration

### Log Email Route (`/api/log-email`)
- **Method:** POST
- **Purpose:** Logs email details to Supabase
- **Request Body:**
  ```typescript
  {
    senderEmail: string
    senderName?: string
    question: string
    emailContent: {
      html: string
      text: string
    }
    resendEmailId?: string
    status: 'sent' | 'failed'
    errorMessage?: string
  }
  ```

### Email Utilities (`lib/email-utils.ts`)
Available functions for querying emails:
- `getAllEmails(limit)`: Get all emails, newest first
- `getEmailsByStatus(status, limit)`: Get emails by status
- `getEmailsBySender(email, limit)`: Get emails from specific sender
- `getEmailStats()`: Get email statistics

## Features

- **Automatic Logging**: All email attempts (successful and failed) are logged
- **Non-blocking**: Email logging doesn't affect the main email sending flow
- **Structured Data**: Emails are stored with full metadata
- **Query Functions**: Easy-to-use functions for retrieving email data
- **Error Handling**: Graceful degradation if Supabase is unavailable

## Security

- Uses Supabase service role key for server-side operations
- Sensitive data is properly handled
- Connection errors are logged but don't break the application flow

## Performance Considerations

- Consider adding indexes on frequently queried columns:
  - `senderEmail`
  - `status`
  - `timestamp`
  - Composite index on `(senderEmail, timestamp)`

Create these indexes in your Supabase dashboard for optimal performance.
