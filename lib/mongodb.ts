import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

if (!process.env.MONGO_URI) {
  throw new Error('Please add your MONGO_URI to .env.local')
}

const uri = process.env.MONGO_URI
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Database and collection getters
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db('main')
}

export async function getEmailsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection('emails')
}

// Email logging interface
export interface EmailLog {
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

// Function to log email to MongoDB
export async function logEmail(emailData: Omit<EmailLog, '_id' | 'timestamp'>): Promise<string | null> {
  try {
    const collection = await getEmailsCollection()
    const emailLog: EmailLog = {
      ...emailData,
      timestamp: new Date(),
    }
    
    const result = await collection.insertOne(emailLog)
    console.log('Email logged to MongoDB:', result.insertedId.toString())
    return result.insertedId.toString()
  } catch (error) {
    console.error('Failed to log email to MongoDB:', error)
    return null
  }
}

export default clientPromise
