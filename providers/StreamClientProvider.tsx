"use client";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { tokenProvider } from '@/actions/stream-actions'
import { Loader } from '@/components/shared/loader'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: React.ReactNode}) => {
  const [videoClient, setVideoClient] = useState <StreamVideoClient | null>(null);
  const {user, isLoaded} = useUser()

  useEffect (() => {
    if (!isLoaded || !user) return;
    if (!apiKey) {
      console.error('Stream API key not found');
      throw new Error('Stream API key not found');
    }

    const client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: {
        id: user?.id,
        name: user?.fullName,
        image: user?.imageUrl,
        email: user?.emailAddresses[0].emailAddress,
      } as User,
      tokenProvider,
    });
    console.log('Stream client created', client);
    setVideoClient(client);
    return () => {
      setVideoClient(null)
    }
  }, [isLoaded, user])

  if (!videoClient) return <Loader />

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};

export default StreamVideoProvider;