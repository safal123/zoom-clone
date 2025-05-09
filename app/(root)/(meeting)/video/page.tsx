"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader } from '@/components/shared/loader'

const VideoPage = () => {
  const user = useUser()
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const router = useRouter()

  const createMeeting = async () => {
    if (!client || !user) return

    try {
      const id = crypto.randomUUID()
      const meeting = await client.call('default', id)

      if (!meeting) {
        throw new Error('Meeting creation failed')
      }

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || ''

      await meeting.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          }
        }
      })

      setCallDetails(meeting)
      toast('Meeting created successfully')
      await router.push(`/video/${id}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to create meeting')
    }
  }

  useEffect (() => {
    if (!client) return
    if (!user) return
    createMeeting ()
  }, [])


  return (
    <Loader />
  )
}

export default VideoPage