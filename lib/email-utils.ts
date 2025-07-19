import { getEmailsCollection, EmailLog } from './mongodb'

// Function to get all emails from the database
export async function getAllEmails(limit: number = 100): Promise<EmailLog[]> {
  try {
    const collection = await getEmailsCollection()
    const emails = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
    
    return emails as EmailLog[]
  } catch (error) {
    console.error('Failed to retrieve emails from MongoDB:', error)
    return []
  }
}

// Function to get emails by status
export async function getEmailsByStatus(status: 'sent' | 'failed', limit: number = 100): Promise<EmailLog[]> {
  try {
    const collection = await getEmailsCollection()
    const emails = await collection
      .find({ status })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
    
    return emails as EmailLog[]
  } catch (error) {
    console.error(`Failed to retrieve ${status} emails from MongoDB:`, error)
    return []
  }
}

// Function to get emails by sender email
export async function getEmailsBySender(senderEmail: string, limit: number = 100): Promise<EmailLog[]> {
  try {
    const collection = await getEmailsCollection()
    const emails = await collection
      .find({ senderEmail })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
    
    return emails as EmailLog[]
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
    const collection = await getEmailsCollection()
    
    const [totalCount, sentCount, failedCount, uniqueSendersCount] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ status: 'sent' }),
      collection.countDocuments({ status: 'failed' }),
      collection.distinct('senderEmail').then(emails => emails.length)
    ])
    
    return {
      total: totalCount,
      sent: sentCount,
      failed: failedCount,
      uniqueSenders: uniqueSendersCount
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
export async function createEmailIndexes(): Promise<void> {
  try {
    const collection = await getEmailsCollection()
    
    // Create indexes for better query performance
    await Promise.all([
      collection.createIndex({ senderEmail: 1 }),
      collection.createIndex({ status: 1 }),
      collection.createIndex({ timestamp: -1 }),
      collection.createIndex({ resendEmailId: 1 }),
      collection.createIndex({ senderEmail: 1, timestamp: -1 })
    ])
    
    console.log('Email collection indexes created successfully')
  } catch (error) {
    console.error('Failed to create email collection indexes:', error)
  }
}
