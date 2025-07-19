import { type NextRequest, NextResponse } from "next/server"
import { logEmail } from "@/lib/mongodb"

interface LogEmailRequest {
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

interface LogEmailResponse {
  success: boolean
  mongoLogId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LogEmailRequest = await request.json()

    // Validate required fields
    if (!body.senderEmail || !body.question || !body.status) {
      console.error("Missing required fields for email logging")
      return NextResponse.json<LogEmailResponse>({ success: false }, { status: 400 })
    }

    // Log to MongoDB
    const mongoLogId = await logEmail({
      senderEmail: body.senderEmail,
      senderName: body.senderName,
      question: body.question,
      emailContent: body.emailContent,
      resendEmailId: body.resendEmailId,
      status: body.status,
      errorMessage: body.errorMessage,
    })

    if (mongoLogId) {
      console.log("Email logged to MongoDB with ID:", mongoLogId)
      return NextResponse.json<LogEmailResponse>({ 
        success: true, 
        mongoLogId 
      }, { status: 200 })
    } else {
      console.error("Failed to log email to MongoDB")
      return NextResponse.json<LogEmailResponse>({ success: false }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in log-email route:", error)
    return NextResponse.json<LogEmailResponse>({ success: false }, { status: 500 })
  }
}
