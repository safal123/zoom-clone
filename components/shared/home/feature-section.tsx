import React from 'react';
import { Video, Users, Monitor, Shield, Zap, Clock } from 'lucide-react';

export const FeatureSection = () => {
  const features = [
    {
      icon: <Video className="h-8 w-8 text-blue-500" />,
      title: 'HD Video Meetings',
      description: 'Crystal clear video with support for up to 100 participants simultaneously'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Team Collaboration',
      description: 'Easily share screens, files, and collaborate in real-time with your team'
    },
    {
      icon: <Monitor className="h-8 w-8 text-blue-500" />,
      title: 'Screen Sharing',
      description: 'Share your entire screen or specific applications with meeting participants'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: 'Enterprise Security',
      description: 'End-to-end encryption keeps your meetings and data secure at all times'
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: 'Low Latency',
      description: 'Optimized performance with minimal lag for smooth communication'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: 'Unlimited Meeting Time',
      description: 'No time limits on your meetings, collaborate as long as you need'
    }
  ];

  return (
    <section className="md:py-20 bg-gray-50 bg-dots-pattern">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for seamless video meetings and team collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};