import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import type { AskWajdiRequest, AskWajdiResponse, AskWajdiError } from "@/types/api"
import { getBaseUrl } from "@/lib/utils"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  let email = ""
  let name: string | undefined = ""
  let question = ""
  
  try {
    const body: AskWajdiRequest = await request.json()
    email = body.email
    name = body.name
    question = body.question

    // Validate required fields
    if (!email || !question) {
      return NextResponse.json<AskWajdiError>({ error: "Email and question are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<AskWajdiError>({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate question length
    if (question.trim().length < 10) {
      return NextResponse.json<AskWajdiError>({ error: "Question must be at least 10 characters long" }, { status: 400 })
    }

    // Send email via Resend
    const emailData = await resend.emails.send({
      from: "AskWajdi <noreply@blsk.dev>",
      to: ["wajdi.ballout@blsk.dev"],
      replyTo: email,
      subject: `New Question from ${name || "Anonymous"} - Ask Wajdi`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">New Question from AskWajdi</h1>
            <p style="color: #64748b; margin: 0; font-size: 14px;">Received ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 16px;">
            <h2 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 16px 0;">Contact Information</h2>
            <p style="margin: 8px 0; color: #4b5563;"><strong>Name:</strong> ${name || "Not provided"}</p>
            <p style="margin: 8px 0; color: #4b5563;"><strong>Email:</strong> ${email}</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
            <h2 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 16px 0;">Question</h2>
            <div style="background: #f8fafc; border-radius: 6px; padding: 16px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${question}</p>
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This email was sent from askwajdi.com
            </p>
          </div>
        </div>
      `,
      text: `
New Question from AskWajdi

Contact Information:
Name: ${name || "Not provided"}
Email: ${email}

Question:
${question}

---
This email was sent from askwajdi.com
Received: ${new Date().toLocaleString()}
      `.trim(),
    })

    console.log("Email sent successfully:", emailData)

    // Prepare email content for logging
    const htmlContent = `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">New Question from AskWajdi</h1>
            <p style="color: #64748b; margin: 0; font-size: 14px;">Received ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 16px;">
            <h2 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 16px 0;">Contact Information</h2>
            <p style="margin: 8px 0; color: #4b5563;"><strong>Name:</strong> ${name || "Not provided"}</p>
            <p style="margin: 8px 0; color: #4b5563;"><strong>Email:</strong> ${email}</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
            <h2 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 16px 0;">Question</h2>
            <div style="background: #f8fafc; border-radius: 6px; padding: 16px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${question}</p>
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This email was sent from askwajdi.com
            </p>
          </div>
        </div>
      `

    const textContent = `
New Question from AskWajdi

Contact Information:
Name: ${name || "Not provided"}
Email: ${email}

Question:
${question}

---
This email was sent from askwajdi.com
Received: ${new Date().toLocaleString()}
      `.trim()

    // Log to MongoDB via separate API call (non-blocking)
    fetch(`${getBaseUrl()}/api/log-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderEmail: email,
        senderName: name,
        question: question,
        emailContent: {
          html: htmlContent,
          text: textContent,
        },
        resendEmailId: emailData.data?.id,
        status: 'sent',
      }),
    }).then(async (response) => {
      if (response.ok) {
        const result = await response.json()
        console.log("Email logged to MongoDB with ID:", result.mongoLogId)
      } else {
        console.error("Failed to log email to MongoDB:", response.statusText)
      }
    }).catch((error) => {
      console.error("Failed to log email to MongoDB (non-blocking):", error)
    })

    return NextResponse.json<AskWajdiResponse>(
      {
        message: "Question submitted successfully",
        emailId: emailData.data?.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing question:", error)

    // Log failed email to MongoDB via separate API call (non-blocking)
    fetch(`${getBaseUrl()}/api/log-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderEmail: email || "unknown",
        senderName: name,
        question: question || "unknown",
        emailContent: {
          html: "",
          text: "",
        },
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      }),
    }).then(async (response) => {
      if (response.ok) {
        const result = await response.json()
        console.log("Failed email logged to MongoDB with ID:", result.mongoLogId)
      } else {
        console.error("Failed to log error to MongoDB:", response.statusText)
      }
    }).catch((logError) => {
      console.error("Failed to log error to MongoDB (non-blocking):", logError)
    })

    // Handle specific Resend errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json<AskWajdiError>({ error: "Email service configuration error" }, { status: 500 })
      }
      if (error.message.includes("domain")) {
        return NextResponse.json<AskWajdiError>({ error: "Email domain not verified" }, { status: 500 })
      }
    }

    return NextResponse.json<AskWajdiError>({ error: "Failed to send email" }, { status: 500 })
  }
}
