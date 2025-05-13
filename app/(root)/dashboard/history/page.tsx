'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Download, Search, Users, Clock, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const HistoryPage = () => {
  const meetings = [
    {
      id: '1',
      title: 'Team Standup',
      date: 'Today, 9:00 AM',
      duration: '30 minutes',
      participants: 8,
      recording: true,
      status: 'completed',
      host: 'Alex Johnson'
    },
    {
      id: '2',
      title: 'Client Meeting',
      date: 'Yesterday, 2:00 PM',
      duration: '45 minutes',
      participants: 5,
      recording: true,
      status: 'completed',
      host: 'Sarah Miller'
    },
    {
      id: '3',
      title: 'Project Review',
      date: 'Jan 15, 11:00 AM',
      duration: '60 minutes',
      participants: 12,
      recording: false,
      status: 'cancelled',
      host: 'Mike Brown'
    }
  ];

  const getStatusStyle = (status: string) => {
    const styles = {
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50',
      missed: 'bg-amber-50 text-amber-700 border-amber-200/50'
    };
    return styles[status as keyof typeof styles] || styles.completed;
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? 'bg-emerald-100' :
      status === 'cancelled' ? 'bg-rose-100' : 'bg-amber-100';
  };

  const { userId } = useAuth()

  // const { data } = useQuery(api.meetings.userAc, {
  //   userId: userId
  // })

  return (
    <div className="space-y-8" >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Meeting History</h2>
        <p className="text-base text-gray-500">View and manage your past meetings and recordings.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm" >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by meeting name, host, or participants..."
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2 w-full">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2 w-full">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <span className="ml-2 rounded-full bg-blue-100/50 px-2 py-0.5 text-xs font-medium text-blue-600">
              2
            </span>
          </Button>
        </div>
      </div >

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >
        {
          [
            { label: 'Total Meetings', value: '156', change: '+12%' },
            { label: 'Meeting Hours', value: '284h', change: '+8%' },
            { label: 'Total Participants', value: '1.2k', change: '+18%' },
            { label: 'Recorded Sessions', value: '89%', change: '+5%' }
          ].map((stat, i) => (
            <Card key={i} className="p-4 flex flex-col">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
              </div>
            </Card>
          ))
        }
      </div >

      {/* Meetings List */}
      < Card className="divide-y divide-gray-200 overflow-hidden bg-white shadow-sm" >
        {
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full shrink-0 border",
                  getStatusStyle(meeting.status)
                )}>
                  <div className={cn("p-2 rounded-full", getStatusIcon(meeting.status))}>
                    <Video className="h-5 w-5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{meeting.title}</h3>
                    <span className={cn(
                      "hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border",
                      getStatusStyle(meeting.status)
                    )}>
                      {meeting.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      {meeting.date}
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      {meeting.participants} participants
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      {meeting.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Hosted by {meeting.host}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-16 sm:ml-0">
                {meeting.recording && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none justify-center border-gray-200 hover:bg-gray-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Download Recording</span>
                    <span className="sm:hidden">Recording</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 sm:flex-none justify-center text-gray-600 hover:text-gray-900"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        }
      </Card >

      {/* Empty State */}
      {
        meetings.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 sm:p-12">
            <div className="rounded-full bg-gray-100 p-3">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No meeting history</h3>
            <p className="mt-1 text-center text-gray-500 max-w-sm">
              Your past meetings and recordings will appear here once you have some meetings.
            </p>
          </div>
        )
      }
    </div >
  );
};

export default HistoryPage; 