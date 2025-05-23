'use client'
import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const convex = new ConvexReactClient (process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function ConvexClientProvider
({
   children
 }: {
  children: ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
  return (
    <ClerkProvider publishableKey={ publishableKey }>
      <ConvexProviderWithClerk client={ convex } useAuth={ useAuth }>
        { children }
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}