'use server'

import { currentUser } from '@clerk/nextjs/server'
import { StreamClient } from '@stream-io/node-sdk'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
const apiSecret =  process.env.STREAM_SECRET_KEY

export const tokenProvider = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error('No user found')
  }

  if (!apiKey || !apiSecret) {
    throw new Error('No api key or secret found')
  }

  const streamClient = new StreamClient(apiKey, apiSecret)
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60

  return streamClient.generateUserToken ({
    user_id: user.id,
    validity_in_seconds: exp,
  })
}