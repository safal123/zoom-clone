'use client'

import { useAuth } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { TopNav } from '@/components/shared/home/top-nav'
import { HeroSection } from '@/components/shared/home/hero-section'
import { FeatureSection } from '@/components/shared/home/feature-section'
import PriceSection from '@/components/shared/home/price-section'

export default function Home() {
  const { userId } = useAuth()
  const user = useQuery(api.users.currentUser);
  return (
    <div className="min-h-screen flex flex-col bg-dots-pattern">
      <TopNav userId={userId}/>
      <HeroSection />
      <FeatureSection />
      <PriceSection />
      <footer className="text-gray-400 py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 ZoomClone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
