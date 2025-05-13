'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Copy, Pencil, Users, Clock, UserPlus, Trash } from 'lucide-react';
import { NewMeetingButton } from '@/components/shared/new-meeting-button';
import { cn } from '@/lib/utils';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LiaSpinnerSolid } from 'react-icons/lia';
import ScheduleMeetingModel, { ScheduleMeetingModelRef } from '@/components/shared/dashboard/meeting/schedule-meeting-model';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddMemberModel from '@/components/shared/dashboard/meeting/add-member-model';
import ViewMembersModal from "@/components/shared/dashboard/meeting/view-members-modal";
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';
import { format } from 'date-fns';

const MeetingsPage = () => {
  const router = useRouter();
  const meetings = useQuery(api.meetings.getAll);
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

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

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
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm">
                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    Created: {format(new Date(meeting._creationTime), 'MMM d, yyyy')}
                  </span>
                  {meeting.startsAt && (
                    <>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className="flex items-center gap-1 text-purple-600 font-medium">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        Starts: {format(new Date(meeting.startsAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </>
                  )}
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    {meeting.participants.length} participants
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    {meeting.duration}
                  </span>
                </div>

                {meeting.participants.length > 0 && (
                  <div className="mt-3 flex -space-x-2 overflow-hidden">
                    {meeting.participants.slice(0, 3).map((participant, i) => (
                      <Avatar key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white">
                        <AvatarImage src={participant.image || ''} alt={participant.name} />
                        <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {meeting.participants.length > 3 && (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium text-gray-700 ring-2 ring-white">
                        +{meeting.participants.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none justify-center text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(meeting.meetingUrl ?? '');
                  toast.success('Link copied to clipboard');
                }}
              >
                <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Copy Link</span>
                <span className="sm:hidden">Link</span>
              </Button>
              <ViewMembersModal meetingId={meeting._id} />
              <AddMemberModel
                meetingId={meeting._id}
              />
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