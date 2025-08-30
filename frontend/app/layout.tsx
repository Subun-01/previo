import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import Navbar from "@/components/navbar"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Previo ",
  description: "AI-powered personalized learning roadmaps with futuristic interface",
  icons: { 
    icon: [ 
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }, 
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }, 
    { url: "/favicon.ico" } 
  ], 
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180" }
  ] 
}, 
  manifest: "/site.webmanifest"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} antialiased min-h-screen`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
