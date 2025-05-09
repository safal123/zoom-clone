import { VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'

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
            <Link href={'/video'}>
              <Button className="shadow-lg flex items-center bg-violet-600 text-white px-6 py-3 rounded-md text-lg hover:bg-violet-700 transition duration-300">
                Create Instant Meeting
                <VideoIcon className="h-6 w-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
