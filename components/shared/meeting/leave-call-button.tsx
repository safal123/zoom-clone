"use client"

import { Button } from '@/components/ui/button'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Loader2 } from 'lucide-react'

const LeaveCallButton = () => {
  const call = useCall()
  const router = useRouter();
  const [leavingCall, setLeavingCall] = React.useState<boolean>(false)
  if (!call) throw new Error('Call not found. Make sure you are in a call before leaving it.');

  const leaveCall = async () => {
    try {
      setLeavingCall(true);
      await call.leave();
      router.push('/');
    } catch (error) {
      console.error('Failed to leave call', error);
    } finally {
      setLeavingCall(false);
    }
  };

  return (
    <Button onClick={leaveCall} className="bg-red-500 hover:bg-red-700 hover:text-white hover:transition-colors">
      {leavingCall ? <Loader2 className="animate-spin" /> : 'Leave call'}
    </Button>
  )
}

export default LeaveCallButton