"use client"

import { Button } from '@/components/ui/button'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Loader2 } from 'lucide-react'

const EndCall = () => {
  const call = useCall()
  const router = useRouter();
  const [endingCall, setEndingCall] = React.useState<boolean>(false)

  if (!call) throw new Error('Call not found. Make sure you are in a call before ending it.');
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    try {
      setEndingCall(true);
      await call.endCall();
      router.push('/');
    } catch (error) {
      console.error('Failed to end call', error);
    } finally {
      setEndingCall(false);
    }
  };

  return (
    <Button onClick={endCall} className="bg-red-500 hover:bg-red-700 hover:text-white hover:transition-colors">
      {endingCall ? <Loader2 className="animate-spin" /> : 'End call for everyone'}
    </Button>
  )
}

export default EndCall