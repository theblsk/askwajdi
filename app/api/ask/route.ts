import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import type { AskWajdiRequest, AskWajdiResponse, AskWajdiError } from "@/types/api"
import { generateEmailContent } from "@/lib/email-templates"

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

    // Generate email content using template
    const emailContent = generateEmailContent({ name, email, question })

    // Send email via Resend
    const emailData = await resend.emails.send({
      from: "AskWajdi <noreply@blsk.dev>",
      to: ["wajdi.ballout@blsk.dev"],
      replyTo: email,
      subject: `New Question from ${name || "Anonymous"} - Ask Wajdi`,
      html: emailContent.html,
      text: emailContent.text,
    })

    console.log("Email sent successfully:", emailData)

    return NextResponse.json<AskWajdiResponse>(
      {
        message: "Question submitted successfully",
        emailId: emailData.data?.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing question:", error)

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
