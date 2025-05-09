'use client'
import { BackgroundFiltersProvider, StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import MeetingRoom from '@/components/shared/meeting/meeting-room'
import MeetingSetup from '@/components/shared/meeting/meeting-setup'
import { useMeetingById } from '@/hooks/useMeetingById'
import { Loader } from '@/components/shared/loader'

const VideoRoomPage = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser ()
  const [isSetupComplete, setIsSetupComplete] = useState<boolean> (false)
  const { call, isCallLoading } = useMeetingById (params.id)

  if (!isLoaded || isCallLoading) return <Loader />

  return (
    <main className={ 'h-screen w-full bg-gray-900' }>
      <StreamCall call={call}>
        <BackgroundFiltersProvider
          backgroundFilter="blur"
          backgroundImages={[
            'https://my-domain.com/bg/random-bg-1.jpg',
            'https://my-domain.com/bg/random-bg-2.jpg',
          ]}
        >
        <StreamTheme>
          { !isSetupComplete ?
            <MeetingSetup setIsSetupComplete={setIsSetupComplete}/> :
            <MeetingRoom />
          }
        </StreamTheme>
        </BackgroundFiltersProvider>
      </StreamCall>
    </main>
  )
}

export default VideoRoomPage