"use client"

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader } from '@/components/shared/loader'
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const VideoPage = () => {
  const { user, isLoaded } = useUser()
  const client = useStreamVideoClient()
  const [callDetails, setCallDetails] = useState<Call>()
  const router = useRouter()

  const getOrCreateRoom = useMutation(api.privateRooms.getOrCreate)
  const updateRoomStatus = useMutation(api.privateRooms.updateStatus)

  const joinOrCreateRoom = useCallback(async () => {
    if (!client || !user || !isLoaded) return

    try {
      // Get or create private room
      const room = await getOrCreateRoom({
        ownerId: user.id,
        ownerName: user.fullName || user.username || 'Anonymous',
        ownerImage: user.imageUrl,
      })

      if (!room) throw new Error('Failed to create room')

      // Join Stream call
      const meeting = await client.call('default', room.streamId)
      await meeting.getOrCreate()

      // Update room status
      await updateRoomStatus({
        streamId: room.streamId,
        isActive: true
      })

      setCallDetails(meeting)
      await router.push(`/video/${room.streamId}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to join room')
    }
  }, [client, user, isLoaded, getOrCreateRoom, updateRoomStatus, router])

  useEffect(() => {
    if (!client) return
    if (!user) return
    if (!isLoaded) return
    joinOrCreateRoom()
  }, [client, user, isLoaded, joinOrCreateRoom])

  return (
    <Loader />
  )
}

export default VideoPage