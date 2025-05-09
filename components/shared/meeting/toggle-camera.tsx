'use client'

import { useCallStateHooks } from '@stream-io/video-react-sdk'
import { CameraIcon, CameraOffIcon, Loader2 } from 'lucide-react'
import React from 'react'

const ToggleCamera = () => {
  const [loading, setLoading] = React.useState<boolean> (false)
  const { useCameraState } = useCallStateHooks ()
  const { camera, isMute } = useCameraState ()
  const toggleCamera = async () => {
    try {
      setLoading (true)
      await camera.toggle ()
      setLoading (false)
    } catch (e) {
      console.error (e)
      setLoading (false)
    }
  }
  return (
    <label className={ 'flex items-center gap-2' }>
      <div
        onClick={ () => toggleCamera ()}
        className={ 'flex items-center justify-center gap-2 h-10 w-10 border rounded-full cursor-pointer' }>
        {
          loading ? <Loader2 className={ 'h-6 w-6 animate-spin' }/> :
          isMute ?
            <CameraOffIcon className={ 'h-6 w-6' }/> :
            <CameraIcon className={ 'h-6 w-6 text-gray-400' }/>
        }
      </div>
    </label>
  )
}

export default ToggleCamera