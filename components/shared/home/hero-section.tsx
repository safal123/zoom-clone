import { VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { NewMeetingButton } from '../new-meeting-button';

export const HeroSection = () => {
  return (
    <main className="flex items-center relative py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center">
        <div className="w-full z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Connect with Your Team Anywhere, Anytime
          </h1>
          <p className="text-lg text-gray-800 mb-8">
            Experience high-quality video calls, screen sharing, and collaborative tools that make remote work feel effortless.
          </p>
          <div className="flex justify-center">
            <NewMeetingButton size='lg' />
          </div>
        </div>
      </div>
    </main>
  );
};
