import React from 'react'
import Image from 'next/image'
import { TeacherAuthNav } from '@/components/shared/teachers/teacher-auth-nav'


const AuthLayout = ({ children }: { children: any }) => {
  return (
    <main className="relative h-screen w-full">
      <div className={'flex items-center p-4 max-w-7xl mx-auto ml-auto'}>
        <div className={'ml-auto'}>
          <TeacherAuthNav />
        </div>
      </div>
      {children}
    </main>
  )
}

export default AuthLayout
