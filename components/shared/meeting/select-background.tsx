'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useBackgroundFilters } from '@stream-io/video-react-sdk'

type Background = {
  id: string;
  name: string;
  type: 'none' | 'blur' | 'image';
  src?: string;
}

const backgrounds: Background[] = [
  {
    id: 'none',
    name: 'None',
    type: 'none'
  },
  {
    id: 'blur',
    name: 'Blur',
    type: 'blur'
  },
  {
    id: 'bg-one',
    name: 'Background 1',
    type: 'image',
    src: '/bg-one.jpeg'
  },
  {
    id: 'bg-two',
    name: 'Background 2',
    type: 'image',
    src: '/bg-two.jpeg'
  }
]

const SelectBackground = () => {
  const {
    isSupported,
    disableBackgroundFilter,
    applyBackgroundBlurFilter,
    applyBackgroundImageFilter,
  } = useBackgroundFilters();

  const setBackground = useCallback(async (background: Background) => {
    if (!isSupported) return;

    switch (background.type) {
      case 'none':
        await disableBackgroundFilter();
        break;
      case 'blur':
        await applyBackgroundBlurFilter('medium');
        break;
      case 'image':
        if (background.src) {
          await applyBackgroundImageFilter(background.src);
        }
        break;
    }
  }, [isSupported, disableBackgroundFilter, applyBackgroundBlurFilter, applyBackgroundImageFilter]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-100">Select Background</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {backgrounds.map((bg) => (
          <Button
            key={bg.id}
            onClick={() => setBackground(bg)}
            className="relative h-24 w-full overflow-hidden rounded-lg border-2 border-gray-700 hover:border-blue-500 focus:border-blue-500"
          >
            {bg.type === 'image' && bg.src ? (
              <Image
                src={bg.src}
                alt={bg.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className={`h-full w-full ${bg.type === 'blur' ? 'bg-gray-600' : 'bg-black'}`} />
            )}
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center text-sm text-white">
              {bg.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SelectBackground
