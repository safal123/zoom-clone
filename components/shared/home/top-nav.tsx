import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

export const TopNav =
  ({
    userId
  }: {
    userId?: string | null
  }) => {
    return (
      <header>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="flex items-center rounded-md px-3 py-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-md">
              <Video className="h-5 w-5" />
              <span className="text-xl font-bold ml-2 hidden sm:inline">MeetSync</span>
            </div>
          </Link>
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="" className="text-gray-700 hover:text-violet-600 font-bold">
                Features
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-gray-700 hover:text-violet-600 font-bold">
                Pricing
              </Link>
            </li>
          </ul>
          {userId ? <div className={'flex gap-2'}>
            <Link href="/dashboard">
              <Button size={'sm'}>Dashboard</Button>
            </Link>
            <UserButton />
          </div> :
            <div className={'flex gap-2'}>
              <Link href={'/sign-in'}>
                <Button size={'sm'}>Sign In</Button>
              </Link>
              <Link href={'/sign-up'}>
                <Button size={'sm'} variant={'secondary'}>Register</Button>
              </Link>
            </div>}
        </nav>
      </header>
    )
  }