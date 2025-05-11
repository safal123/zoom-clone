import React from 'react'
import StreamClientProvider from '@/providers/StreamClientProvider'
import { Logo } from '@/components/shared/logo'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const VideoLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StreamClientProvider>
        <main className="h-[calc(100vh-4rem)]">
          {children}
        </main>
      </StreamClientProvider>
    </div>
  )
}

export default VideoLayout