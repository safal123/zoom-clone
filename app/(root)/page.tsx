'use client'

import { useAuth } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { TopNav } from '@/components/shared/home/top-nav'
import { HeroSection } from '@/components/shared/home/hero-section'
import { FeatureSection } from '@/components/shared/home/feature-section'
import PriceSection from '@/components/shared/home/price-section'
import { Video, Mail, Github, Twitter } from 'lucide-react'

export default function Home() {
  const { userId } = useAuth()
  const user = useQuery(api.users.currentUser);
  return (
    <div className="min-h-screen flex flex-col bg-dots-pattern">
      <TopNav userId={userId} />
      <HeroSection />
      <FeatureSection />
      <PriceSection />
      <footer className="bg-gradient-to-r from-violet-600/90 to-blue-500/90 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center mb-6 md:mb-0">
              <Video className="h-7 w-7 text-white mr-2" />
              <span className="text-2xl font-bold">MeetSync</span>
            </div>
            <div className="flex space-x-5">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Download</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-white/70">&copy; {new Date().getFullYear()} MeetSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
