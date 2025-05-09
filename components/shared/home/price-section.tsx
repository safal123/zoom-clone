import React from "react";
import PricingCard from '@/components/shared/price-card'

const PricingPage = () => {
  return (
    <div id={'pricing'} className="bg-gray-100 py-12 px-6 bg-dots-pattern">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600">
          Find the plan that's right for you and your team.
        </p>
      </header>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PricingCard
          title="Basic Plan"
          price={10}
          features={[
            "Up to 10 participants",
            "Unlimited meetings",
            "Basic support",
          ]}
          buttonLabel="Get Started"
        />
        <PricingCard
          title="Pro Plan"
          price={25}
          features={[
            "Up to 50 participants",
            "Unlimited meetings",
            "Priority support",
            "Advanced analytics",
          ]}
          buttonLabel="Get Started"
          isPopular={true}
        />
        <PricingCard
          title="Enterprise Plan"
          price={50}
          features={[
            "Unlimited participants",
            "Unlimited meetings",
            "24/7 support",
            "Dedicated account manager",
            "Custom features",
          ]}
          buttonLabel="Contact Sales"
        />
      </div>
    </div>
  );
};

export default PricingPage;
