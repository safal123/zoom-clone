'use client'

import React from 'react'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ToggleMic from '@/components/shared/meeting/toggle-mic'
import ToggleCamera from '@/components/shared/meeting/toggle-camera'

const MeetingSetup = ({ setIsSetupComplete }: {
  setIsSetupComplete: (isSetupComplete: boolean) => void
}) => {
  const call = useCall ()
  const { user } = useUser ()
  const router = useRouter ()

  if (!call) {
    throw new Error ('Call is not available')
  }


  return (
    <div className="flex h-screen w-full flex-col items-center gap-3 text-white">
      <div
        className={ 'bg-black max-w-4xl w-full p-8 rounded-md items-center justify-center flex flex-col gap-4 mt-12 shadow-lg' }>
        <h1 className="text-3xl font-bold mt-12 text-gray-100">
          Setup your camera and microphone
        </h1>
        <div className="flex items-center justify-center w-full mt-12">
          <VideoPreview
            DisabledVideoPreview={ () =>
              <div>
                <Image src={ user?.imageUrl || '' } alt={ 'profile imgae' } width={ 200 } height={ 200 }
                       className={ 'rounded-full' }/>
              </div>
            }
          />
        </div>
        <div className={ 'flex h-16 items-center justify-center gap-3' }>
          <ToggleCamera/>
          <ToggleMic/>
          <div className={ 'flex items-center justify-center gap-2 border h-10 w-10 rounded-full' }>
            <DeviceSettings/>
          </div>
        </div>
        <div className={ 'flex gap-4' }>
          <Button
            className={ 'rounded-md bg-green-500 px-4 py-2.5 hover:bg-green-600' }
            onClick={ () => {
              setIsSetupComplete (true)
              call.join ()
            } }>
            { call?.state?.createdBy?.id === user?.id ? 'Start Meeting' : 'Join Meeting' }
          </Button>
          <Button
            className={ 'rounded-md bg-red-500 px-4 py-2.5 hover:bg-red-600' }
            onClick={ async () => {
              call?.state?.createdBy?.id === user?.id ? call?.endCall () : call.leave ()
              setIsSetupComplete (false)
              await router.push ('/')
            } }>
            { call?.state?.createdBy?.id === user?.id ? 'Cancel Meeting' : 'Leave Meeting' }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MeetingSetup