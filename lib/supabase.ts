import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Please add your NEXT_PUBLIC_SUPABASE_URL to .env')
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('Please add your SUPABASE_KEY to .env')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseKey)

// Email logging interface
export interface EmailLog {
  id?: number
  senderEmail: string
  senderName?: string
  question: string
  emailContent: {
    html: string
    text: string
  }
  resendEmailId?: string
  timestamp?: string
  status: 'sent' | 'failed'
  errorMessage?: string
}

// Function to log email to Supabase
export async function logEmail(emailData: Omit<EmailLog, 'id' | 'timestamp'>): Promise<string | null> {
  try {
    const emailLog: Omit<EmailLog, 'id'> = {
      ...emailData,
      timestamp: new Date().toISOString(),
    }
    
    const { data, error } = await supabase
      .from('Emails')
      .insert(emailLog)
      .select('id')
      .single()
    
    if (error) {
      console.error('Failed to log email to Supabase:', error)
      return null
    }
    
    console.log('Email logged to Supabase:', data.id)
    return data.id.toString()
  } catch (error) {
    console.error('Failed to log email to Supabase:', error)
    return null
  }
}
