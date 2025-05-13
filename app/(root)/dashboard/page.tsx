'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Video, Users, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewMeetingButton } from '@/components/shared/new-meeting-button';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const router = useRouter();

  const stats = [
    {
      title: 'Total Meetings',
      value: '245',
      icon: <Video className="h-6 w-6" />,
      description: 'Last 30 days',
      color: 'blue'
    },
    {
      title: 'Total Participants',
      value: '1,234',
      icon: <Users className="h-6 w-6" />,
      description: 'Across all meetings',
      color: 'green'
    },
    {
      title: 'Meeting Hours',
      value: '432',
      icon: <Clock className="h-6 w-6" />,
      description: 'Total duration',
      color: 'purple'
    }
  ];

  const getGradientByColor = (color: string) => {
    const gradients = {
      blue: 'from-blue-50 to-blue-100/50',
      green: 'from-green-50 to-green-100/50',
      purple: 'from-purple-50 to-purple-100/50'
    };
    return gradients[color as keyof typeof gradients];
  };

  const getIconColorByColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-base text-gray-500">Here&apos;s what&apos;s happening with your meetings.</p>
        </div>
        <div className="flex justify-start sm:justify-end">
          <NewMeetingButton
            size="sm"
            className="w-full sm:w-auto min-w-[140px]"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={cn(
              "p-6 transition-all hover:shadow-lg bg-gradient-to-br",
              getGradientByColor(stat.color)
            )}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  getIconColorByColor(stat.color)
                )}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-sm text-gray-500">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            onClick={() => router.push('/dashboard/history')}
          >
            <span className="hidden sm:inline">View all</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Card className="divide-y divide-gray-200 overflow-hidden">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0">
              <div className="space-y-2 sm:space-y-1">
                <p className="font-medium text-gray-900">Team Sync Meeting</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-gray-500 min-w-[120px]">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    12 participants
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-sm text-gray-500 min-w-[100px]">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    45 minutes
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <span className="text-sm text-gray-500">2 hours ago</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
