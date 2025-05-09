import { FeatureCard } from '@/components/shared/home/featured-card'

export const FeatureSection = () => {
  return (
    <section className="bg-white/10 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-violet-800 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="High-Quality Video"
            description="Crystal clear video quality to ensure you never miss a moment."
            icon="🎥"
          />
          <FeatureCard
            title="Screen Sharing"
            description="Share your screen with others seamlessly during calls."
            icon="🖥️"
          />
          <FeatureCard
            title="Secure Meetings"
            description="Your meetings are safe with our end-to-end encryption."
            icon="🔒"
          />
        </div>
      </div>
    </section>
  )
}