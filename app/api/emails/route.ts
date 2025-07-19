import { type NextRequest, NextResponse } from "next/server"
import { getAllEmails, getEmailStats } from "@/lib/email-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const stats = searchParams.get('stats') === 'true'
    
    if (stats) {
      const emailStats = await getEmailStats()
      return NextResponse.json(emailStats, { status: 200 })
    }
    
    const emails = await getAllEmails(limit)
    return NextResponse.json({ emails, count: emails.length }, { status: 200 })
  } catch (error) {
    console.error("Error retrieving emails:", error)
    return NextResponse.json({ error: "Failed to retrieve emails" }, { status: 500 })
  }
}
