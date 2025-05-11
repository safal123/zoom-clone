'use client';

import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NewMeetingButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const NewMeetingButton = ({
  variant = 'default',
  size = 'default',
  className
}: NewMeetingButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);

    setTimeout(() => {
      router.push('/video');
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, 1000);
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={cn(
        "flex items-center gap-2",
        variant === 'default' && "bg-blue-600 hover:bg-blue-700 text-white",
        isLoading && "cursor-not-allowed opacity-75",
        className
      )}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isLoading ? "Creating..." : "New Meeting"}
      {!isLoading && <Video className="h-4 w-4" />}
    </Button>
  );
}; 