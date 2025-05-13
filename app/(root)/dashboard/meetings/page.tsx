'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Copy, Pencil, Users, Clock } from 'lucide-react';
import { NewMeetingButton } from '@/components/shared/new-meeting-button';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LiaSpinnerSolid } from 'react-icons/lia';
import ScheduleMeetingModel, { ScheduleMeetingModelRef } from '@/components/shared/dashboard/meeting/schedule-meeting-model';
import { useRef, useState } from 'react';

const MeetingsPage = () => {
  const router = useRouter();
  const meetings = useQuery(api.meetings.getAll);
  // Track which meeting is being edited
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    const styles = {
      upcoming: 'bg-blue-50 text-blue-700',
      scheduled: 'bg-green-50 text-green-700',
      completed: 'bg-gray-50 text-gray-700',
      cancelled: 'bg-red-50 text-red-700'
    };
    return styles[status as keyof typeof styles] || styles.scheduled;
  };

  if (meetings === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LiaSpinnerSolid className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Meetings</h2>
          <p className="mt-1 text-gray-500">Schedule and manage your meetings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingModel />
          <NewMeetingButton
            className="w-full sm:w-auto"
            text="Instant Meeting"
          />
        </div>
      </div>

      {/* Meetings List */}
      <Card className="divide-y divide-gray-200 overflow-hidden">
        {meetings?.map((meeting) => (
          <div
            key={meeting._id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full shrink-0",
                getStatusStyle(meeting.status)
              )}>
                <Video className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 truncate">{meeting.title}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    {meeting._creationTime}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    {meeting.participants.length} participants
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    {meeting.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row sm:flex-row items-center gap-2 ml-16 sm:ml-0">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none justify-center"
                onClick={() => { }}
              >
                <Copy className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Copy Link</span>
                <span className="sm:hidden">Link</span>
              </Button>
              <ScheduleMeetingModel
                mode='edit'
                meetingId={meeting._id}
                defaultValues={{
                  title: meeting.title,
                  description: meeting.description,
                  duration: meeting.duration,
                  isRecurring: meeting.isRecurring,
                  requireRegistration: meeting.requireRegistration,
                  maxParticipants: meeting.maxParticipants,
                  streamId: meeting.streamId,
                  startsAt: meeting.startsAt,
                }} />
            </div>
          </div>
        ))}
      </Card>

      {/* Empty State */}
      {meetings?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 sm:p-12">
          <Video className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No meetings scheduled</h3>
          <p className="mt-1 text-center text-gray-500 max-w-sm">
            Get started by scheduling a new meeting or creating an instant meeting.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => router.push('/video')}>
              Schedule Meeting
            </Button>
            <NewMeetingButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage; 