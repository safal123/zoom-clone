import React from "react";

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  buttonLabel: string;
  isPopular?: boolean;
}

const PricingCard = ({ title, price, features, buttonLabel, isPopular }: PricingCardProps) => {
  return (
    <div className={`relative bg-white p-8 rounded-lg shadow-md transform transition hover:scale-105 ${isPopular ? "border-2 border-violet-500" : ""}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="text-4xl font-bold text-gray-900 mb-6">
        ${price}
        <span className="text-base font-medium text-gray-500">/month</span>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-700 flex items-center">
            <span className="mr-2 text-green-500">✔</span> {feature}
          </li>
        ))}
      </ul>
      <button className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition duration-300">
        {buttonLabel}
      </button>
    </div>
  );
};

export default PricingCard;
