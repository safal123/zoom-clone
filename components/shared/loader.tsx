import { LiaSpinnerSolid } from 'react-icons/lia'
import React from 'react'

export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        Loading...
        <LiaSpinnerSolid className="w-12 h-12 animate-spin"/>
      </div>
    </div>
  )
}