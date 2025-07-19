import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
  // Check if we have NEXT_PUBLIC_BASE_URL in environment
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  // Check if we have VERCEL_URL (Vercel deployment)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000'
}
