# AskWajdi Landing Page

A minimal, modern landing page for askwajdi.com that allows software developers to ask Wajdi Ballout questions.

## Features

- Clean, professional developer-focused design
- Dark/light mode toggle with system preference detection
- Responsive form with validation
- Email notifications via Resend
- Built with Next.js 15 and Tailwind CSS

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 2. Resend Configuration

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain and verify it (or use the sandbox domain for testing)
4. Update the environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `WAJDI_EMAIL`: The email address where questions should be sent
   - `FROM_EMAIL_DOMAIN`: Your verified domain (e.g., askwajdi.com)

### 3. Update Email Configuration

In `app/api/ask/route.ts`, update these values:
- `from`: Change to your verified domain email
- `to`: Change to Wajdi's actual email address

### 4. Install and Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Email Template

The system sends beautifully formatted HTML emails with:
- Contact information (name and email)
- The full question text
- Timestamp
- Professional styling matching the site design

## Deployment

Deploy to Vercel with one click, or manually:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Domain Setup for Production

For production use:
1. Add your domain to Resend
2. Add the required DNS records
3. Wait for verification
4. Update the `from` email address in the API route
