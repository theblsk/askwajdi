export interface AskWajdiRequest {
  name?: string
  email: string
  question: string
}

export interface AskWajdiResponse {
  message: string
  emailId?: string
  mongoLogId?: string | null
}

export interface AskWajdiError {
  error: string
}
