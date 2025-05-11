import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Poppins } from 'next/font/google'
import './globals.css'
import ConvexClientProvider from '@/app/providers/ConvexClientProvider'
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { LiaSpinnerSolid } from 'react-icons/lia'
import React from 'react'
import { cn } from '@/lib/utils'
import { Toaster } from "@/components/ui/sonner"
import '@stream-io/video-react-sdk/dist/css/styles.css';


export const metadata: Metadata = {
  title: 'Video Conference',
  description: 'Make video calls with your friends and family',
}

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-work-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  preload: false,
});

export default function RootLayout
  ({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background', jakarta.className)}>
        <ConvexClientProvider>
          <ClerkLoading>
            <div className="flex items-center justify-center h-screen">
              <div className="flex flex-col items-center gap-3 animate-pulse">
                Loading...
                <LiaSpinnerSolid className="w-12 h-12 animate-spin" />
              </div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {children}
          </ClerkLoaded>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  )
}
