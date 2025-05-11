'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const HistoryPage = () => {
  const meetings = [
    {
      id: '1',
      title: 'Team Standup',
      date: 'Today, 9:00 AM',
      duration: '30 minutes',
      participants: 8,
      recording: true
    },
    {
      id: '2',
      title: 'Client Meeting',
      date: 'Yesterday, 2:00 PM',
      duration: '45 minutes',
      participants: 5,
      recording: true
    },
    {
      id: '3',
      title: 'Project Review',
      date: 'Jan 15, 11:00 AM',
      duration: '60 minutes',
      participants: 12,
      recording: false
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Meeting History</h2>
        <p className="mt-1 text-gray-500">View and manage your past meetings.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search meetings..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Filter
        </Button>
      </div>

      {/* Meetings List */}
      <Card className="divide-y divide-gray-200">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Video className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <span>{meeting.date}</span>
                  <span>•</span>
                  <span>{meeting.duration}</span>
                  <span>•</span>
                  <span>{meeting.participants} participants</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {meeting.recording && (
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Recording
                </Button>
              )}
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Empty State */}
      {meetings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12">
          <Video className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No meeting history</h3>
          <p className="mt-1 text-center text-gray-500">
            Your past meetings will appear here once you have some meetings.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 