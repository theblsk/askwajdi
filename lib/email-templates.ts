interface EmailTemplateData {
  name?: string
  email: string
  question: string
}

export function generateEmailHtml({ name, email, question }: EmailTemplateData): string {
  return `
        <div style="font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
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
}

export function generateEmailText({ name, email, question }: EmailTemplateData): string {
  return `
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
}

export function generateEmailContent(data: EmailTemplateData) {
  return {
    html: generateEmailHtml(data),
    text: generateEmailText(data)
  }
}
