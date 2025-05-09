import React from 'react'
import StreamClientProvider from '@/providers/StreamClientProvider'
import { Logo } from '@/components/shared/logo'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const TeacherLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div>
      <nav className="bg-gray-700 shadow">
        <div className="container mx-auto px-6 py-3 flex justify-between">
          <Link href={'/'}>
            <Logo />
          </Link>
          <UserButton
          />
        </div>
      </nav>
      <StreamClientProvider>
        <div className={ 'min-h-screen' }>
          { children }
        </div>
      </StreamClientProvider>
    </div>
  )
}

export default TeacherLayout