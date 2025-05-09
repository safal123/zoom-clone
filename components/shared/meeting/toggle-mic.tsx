'use client'

import { useCallStateHooks } from '@stream-io/video-react-sdk'
import { Loader2, Mic, MicOff } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { className } from 'postcss-selector-parser'

const ToggleMic = () => {
  const [loading, setLoading] = React.useState<boolean> (false)
  const { useMicrophoneState } = useCallStateHooks ()
  const { microphone, isMute } = useMicrophoneState ()

  const toggleMic = async () => {
    try {
      setLoading (true)
      await microphone.toggle ()
      setLoading (false)
    } catch (e) {
      console.error (e)
      setLoading (false)
    }
  }

  return (
    <label className={ 'flex items-center gap-2' }>
      {isMute}
      <div
        onClick={ () => toggleMic ()}
        className={ 'flex items-center justify-center gap-2 h-10 w-10 border rounded-full cursor-pointer' }>
        {
          loading ? <Loader2 className={ 'h-6 w-6 animate-spin' }/> :
          isMute ?
            <MicOff className={ 'h-6 w-6' }/> :
            <Mic className={ 'h-6 w-6 text-gray-400' }/>
        }
      </div>
    </label>
  )
}

export default ToggleMic