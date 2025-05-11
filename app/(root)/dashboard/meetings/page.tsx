'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Copy, MoreVertical } from 'lucide-react';

const MeetingsPage = () => {
  const router = useRouter();

  const meetings = [
    {
      id: '1',
      title: 'Weekly Team Sync',
      date: 'Today, 2:00 PM',
      participants: 8,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Product Review',
      date: 'Tomorrow, 10:00 AM',
      participants: 12,
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Client Presentation',
      date: 'Thu, 11:30 AM',
      participants: 5,
      status: 'scheduled'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Meetings</h2>
          <p className="mt-1 text-gray-500">Schedule and manage your meetings.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/video')}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button onClick={() => router.push('/video')}>
            <Video className="mr-2 h-4 w-4" />
            Start Meeting
          </Button>
        </div>
      </div>

      {/* Meetings List */}
      <Card className="divide-y divide-gray-200">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                <p className="text-sm text-gray-500">
                  {meeting.date} • {meeting.participants} participants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { }}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* No Meetings State */}
      {meetings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12">
          <Video className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No meetings scheduled</h3>
          <p className="mt-1 text-center text-gray-500">
            Get started by scheduling a new meeting or creating an instant meeting.
          </p>
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => router.push('/video')}>
              Schedule Meeting
            </Button>
            <Button onClick={() => router.push('/video')}>Start Meeting</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage; 