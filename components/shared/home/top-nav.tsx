import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const TopNav =
  ({
     userId
   }: {
    userId?: string | null
  }) => {
    return (
      <header>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-violet-100 bg-violet-700 text-violet-50 rounded-md px-2 py-1">ZoomClone</div>
          <ul className="flex space-x-6">
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
          { userId ? <UserButton/> : <div className={ 'flex gap-2' }>
            <Link href={ '/sign-in' }>
              <Button size={ 'sm' }>Sign In</Button>
            </Link>
            <Link href={ '/sign-up' }>
              <Button size={ 'sm' } variant={ 'secondary' }>Register</Button>
            </Link>
          </div> }
        </nav>
      </header>
    )
  }