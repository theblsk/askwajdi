import { supabase, EmailLog } from './supabase'

// Function to get all emails from the database
export async function getAllEmails(limit: number = 100): Promise<EmailLog[]> {
  try {
    const { data, error } = await supabase
      .from('Emails')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Failed to retrieve emails from Supabase:', error)
      return []
    }
    
    return data as EmailLog[]
  } catch (error) {
    console.error('Failed to retrieve emails from Supabase:', error)
    return []
  }
}

// Function to get emails by status
export async function getEmailsByStatus(status: 'sent' | 'failed', limit: number = 100): Promise<EmailLog[]> {
  try {
    const { data, error } = await supabase
      .from('Emails')
      .select('*')
      .eq('status', status)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error(`Failed to retrieve ${status} emails from Supabase:`, error)
      return []
    }
    
    return data as EmailLog[]
  } catch (error) {
    console.error(`Failed to retrieve ${status} emails from Supabase:`, error)
    return []
  }
}

// Function to get emails by sender email
export async function getEmailsBySender(senderEmail: string, limit: number = 100): Promise<EmailLog[]> {
  try {
    const { data, error } = await supabase
      .from('Emails')
      .select('*')
      .eq('senderEmail', senderEmail)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error(`Failed to retrieve emails from sender ${senderEmail}:`, error)
      return []
    }
    
    return data as EmailLog[]
  } catch (error) {
    console.error(`Failed to retrieve emails from sender ${senderEmail}:`, error)
    return []
  }
}

// Function to get email statistics
export async function getEmailStats(): Promise<{
  total: number
  sent: number
  failed: number
  uniqueSenders: number
}> {
  try {
    const [totalResult, sentResult, failedResult, uniqueSendersResult] = await Promise.all([
      supabase.from('Emails').select('*', { count: 'exact', head: true }),
      supabase.from('Emails').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
      supabase.from('Emails').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('Emails').select('senderEmail').then(response => {
        if (response.error) return { data: [] }
        const uniqueEmails = new Set(response.data?.map(item => item.senderEmail) || [])
        return { data: Array.from(uniqueEmails) }
      })
    ])
    
    return {
      total: totalResult.count || 0,
      sent: sentResult.count || 0,
      failed: failedResult.count || 0,
      uniqueSenders: uniqueSendersResult.data?.length || 0
    }
  } catch (error) {
    console.error('Failed to retrieve email statistics:', error)
    return {
      total: 0,
      sent: 0,
      failed: 0,
      uniqueSenders: 0
    }
  }
}

// Function to create indexes for better performance
// Note: In Supabase, indexes are typically managed through the dashboard or SQL
export async function createEmailIndexes(): Promise<void> {
  try {
    // This function is kept for compatibility but Supabase indexes
    // should be managed through the Supabase dashboard or direct SQL
    console.log('Email table indexes should be managed through Supabase dashboard')
  } catch (error) {
    console.error('Note: Indexes should be managed through Supabase dashboard:', error)
  }
}
