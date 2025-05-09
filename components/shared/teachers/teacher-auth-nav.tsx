import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const TeacherAuthNav = () => {
  return (
    <div className={'flex items-center gap-4'}>
      <Link href='/sign-in'>
        <Button>
          Log In
        </Button>
      </Link>
      <Link href='/sign-up'>
        <Button variant={'outline'}>Sign Up</Button>
      </Link>
    </div>
  )
}