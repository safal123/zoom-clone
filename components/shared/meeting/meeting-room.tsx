import React from 'react'
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  ParticipantView,
  SpeakerLayout,
  useCall,
  hasScreenShare,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EndCall from '@/components/shared/meeting/end-call'
import LeaveCallButton from '@/components/shared/meeting/leave-call-button'
import ToggleMic from '@/components/shared/meeting/toggle-mic'
import ToggleCamera from '@/components/shared/meeting/toggle-camera'
import ToggleLayout from '@/components/shared/meeting/toggle-layout'
import { Reaction } from '@stream-io/video-react-sdk/src/components/Reaction'

type CallLayout = 'speaker-left' | 'speaker-right' | 'grid'

const MeetingRoom = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const router = useRouter ()
  const [layout, setLayout] = React.useState<CallLayout> ('speaker-left')
  const [showParticipantsBar, setShowParticipantsBar] = React.useState<boolean> (true)
  const call = useCall ()

  const CallLayout = () => {
    switch (layout) {
      case 'grid': {
        return <PaginatedGridLayout/>
      }
      case 'speaker-left': {
        return <SpeakerLayout participantsBarPosition={ 'left' }/>
      }
      default: {
        return <SpeakerLayout participantsBarPosition={ 'right' }/>
      }
    }
  }

  return (
    <section className="relative h-screen w-full">
      <div className={ 'flex flex-col items-center justify-end' }>
        <div className={ 'flex size-full md:w-full text-white h-[calc(100vh-150px)]' }>
          <CallLayout />
        </div>
        <div className={ cn ('h-[calc(100vh-106px)] hidden ml-2', { 'show-block': showParticipantsBar }) }>
          <CallParticipantsList onClose={ () => setShowParticipantsBar (false) }/>
        </div>
        <div className="fixed bottom-0 w-full bg-black text-white">
          <div className="flex gap-4 items-center justify-center p-4 w-full overflow-auto">
            <div className={'hidden lg:block'}>
              <CallControls
                onLeave={async () => {
                  toast.success('Call Ended successfully!')
                  await router.push(`/`)
                }}
              />
            </div>
            <ToggleCamera />
            <ToggleMic />
            <CallStatsButton />
            <div className="flex gap-4">
              <ToggleLayout layout={layout} setLayout={setLayout} />
              <LeaveCallButton />
              <EndCall />
            </div>
          </div>
        </div>
      </div>
      <div className={ 'fixed bottom-0 right-0 p-4 w-[400px] text-white' }>
      </div>
    </section>
  )
}

export default MeetingRoom