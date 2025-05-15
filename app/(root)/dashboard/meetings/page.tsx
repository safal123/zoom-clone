'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Copy, Search, Users, Clock, UserPlus, Download, Filter, ChevronDown, CopyIcon, ArrowUpRight, ArrowRight, PlayCircle, Share2 } from 'lucide-react';
import { NewMeetingButton } from '@/components/shared/new-meeting-button';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LiaSpinnerSolid } from 'react-icons/lia';
import ScheduleMeetingModel from '@/components/shared/dashboard/meeting/schedule-meeting-model';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddMemberModel from '@/components/shared/dashboard/meeting/add-member-model';
import ViewMembersModal from "@/components/shared/dashboard/meeting/view-members-modal";
import { toast } from 'sonner';
import { format, isPast, isFuture, isToday, addMinutes } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MeetingsPage = () => {
  const router = useRouter();
  const meetings = useQuery(api.meetings.getAll);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get meeting status (live, upcoming, etc)
  const getMeetingStatus = (meeting: any) => {
    if (!meeting.startsAt) return { status: 'scheduled', label: 'Scheduled' };

    const startDate = new Date(meeting.startsAt);
    const endDate = addMinutes(startDate, meeting.duration);
    const now = new Date();

    if (now >= startDate && now <= endDate) {
      return { status: 'live', label: 'Live Now' };
    } else if (isToday(startDate) && isFuture(startDate)) {
      return { status: 'today', label: 'Today' };
    } else if (isFuture(startDate)) {
      return { status: 'upcoming', label: 'Upcoming' };
    } else if (isPast(endDate)) {
      return { status: 'ended', label: 'Ended' };
    }

    return { status: 'scheduled', label: 'Scheduled' };
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      today: 'bg-blue-50 text-blue-700 border-blue-200',
      upcoming: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      scheduled: 'bg-gray-50 text-gray-700 border-gray-200',
      ended: 'bg-gray-50 text-gray-700 border-gray-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      missed: 'bg-amber-50 text-amber-700 border-amber-200/50'
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

  // Function to filter meetings based on search query
  const filterMeetings = (meetingsList: any[], query: string) => {
    if (!query) return meetingsList;

    return meetingsList.filter(meeting =>
      meeting.title?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Filter meetings based on search query
  const filteredMeetings = filterMeetings(meetings || [], searchQuery);

  // Sort meetings by status and start time
  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    const statusA = getMeetingStatus(a).status;
    const statusB = getMeetingStatus(b).status;

    // First sort by active/today status
    if (statusA === 'live' && statusB !== 'live') return -1;
    if (statusB === 'live' && statusA !== 'live') return 1;
    if (statusA === 'today' && statusB !== 'today' && statusB !== 'live') return -1;
    if (statusB === 'today' && statusA !== 'today' && statusA !== 'live') return 1;

    // Then sort by start time
    const timeA = a.startsAt ? new Date(a.startsAt).getTime() : 0;
    const timeB = b.startsAt ? new Date(b.startsAt).getTime() : 0;
    return timeA - timeB;
  });

  // Group meetings by status
  const liveMeetings = sortedMeetings.filter(meeting => getMeetingStatus(meeting).status === 'live');
  const todayMeetings = sortedMeetings.filter(meeting => getMeetingStatus(meeting).status === 'today');
  const upcomingMeetings = sortedMeetings.filter(meeting =>
    ['upcoming', 'scheduled'].includes(getMeetingStatus(meeting).status)
  );
  const pastMeetings = sortedMeetings.filter(meeting => getMeetingStatus(meeting).status === 'ended');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Meetings</h2>
          <p className="mt-1 text-gray-500">Schedule, manage, and view your meetings history.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingModel />
          <NewMeetingButton
            className="w-full sm:w-auto"
            text="Instant Meeting"
          />
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search meetings by title..."
          className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {/* Live Meetings */}
        {liveMeetings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Live Now
            </h3>
            <Card className="divide-y divide-gray-200 overflow-hidden border-emerald-200 shadow-sm">
              {liveMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-6 hover:bg-emerald-50/30 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4 lg:mb-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0 bg-emerald-100 text-emerald-700">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate flex items-center gap-2">
                        {meeting.title}
                        <Badge className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-200">
                          Live
                        </Badge>
                        <CopyIcon
                          onClick={() => {
                            navigator.clipboard.writeText(meeting.meetingUrl ?? '');
                            toast.success('Link copied to clipboard');
                          }}
                          className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        />
                      </h3>
                      <div className="flex flex-col sm:flex-col gap-y-2 mt-2 text-xs sm:text-sm">
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          Started: {format(new Date(meeting.startsAt), 'MMM d, yyyy h:mm a')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {meeting.participants.length} participants
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            {meeting.duration} min
                          </span>
                        </div>
                      </div>

                      {meeting.participants.length > 0 && (
                        <div className="mt-3 flex -space-x-2 overflow-hidden">
                          {meeting.participants.slice(0, 3).map((participant: { image?: string; name: string }, i: number) => (
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
                  <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
                    <Button
                      className="flex-1 md:flex-none justify-center text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        if (meeting.meetingUrl) {
                          window.open(meeting.meetingUrl, '_blank');
                        }
                      }}
                    >
                      <ArrowUpRight className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Join Now</span>
                    </Button>
                    <div className="flex gap-2 flex-1 md:flex-none justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(meeting.meetingUrl ?? '');
                          toast.success('Link copied to clipboard');
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <ViewMembersModal meetingId={meeting._id} />
                      <AddMemberModel meetingId={meeting._id} />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Today's Meetings */}
        {todayMeetings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Today&apos;s Meetings</h3>
            <Card className="divide-y divide-gray-200 overflow-hidden border-blue-200 shadow-sm">
              {todayMeetings.map((meeting) => renderMeetingCard(meeting))}
            </Card>
          </div>
        )}

        {/* Upcoming Meetings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
          <Card className="divide-y divide-gray-200 overflow-hidden">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => renderMeetingCard(meeting))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 sm:p-12">
                <Video className="h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming meetings</h3>
                <p className="mt-1 text-center text-gray-500 max-w-sm">
                  Get started by scheduling a new meeting or creating an instant meeting.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={() => {
                    const scheduleModelButton = document.querySelector("[data-schedule-button]");
                    if (scheduleModelButton) {
                      (scheduleModelButton as HTMLButtonElement).click();
                    }
                  }}>
                    Schedule Meeting
                  </Button>
                  <NewMeetingButton />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Past Meetings</h3>
            <Card className="divide-y divide-gray-200 overflow-hidden">
              {pastMeetings.map((meeting) => renderMeetingCard(meeting))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to render meeting cards consistently
  function renderMeetingCard(meeting: any) {
    const meetingStatus = getMeetingStatus(meeting);

    return (
      <div
        key={meeting._id}
        className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-start gap-4 mb-4 lg:mb-0">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full shrink-0",
            getStatusStyle(meetingStatus.status)
          )}>
            <Video className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate flex items-center gap-2">
              {meeting.title}
              {meetingStatus.status !== 'scheduled' && (
                <Badge className={cn("ml-2", getStatusStyle(meetingStatus.status))}>
                  {meetingStatus.label}
                </Badge>
              )}
              <CopyIcon
                onClick={() => {
                  navigator.clipboard.writeText(meeting.meetingUrl ?? '');
                  toast.success('Link copied to clipboard');
                }}
                className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
              />
            </h3>
            <div className="flex flex-col sm:flex-col gap-y-2 mt-2 text-xs sm:text-sm">
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                {meeting.startsAt
                  ? `Starts: ${format(new Date(meeting.startsAt), 'MMM d, yyyy h:mm a')}`
                  : `Created: ${format(new Date(meeting._creationTime), 'MMM d, yyyy')}`
                }
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  {meeting.participants.length} participants
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  {meeting.duration} min
                </span>
              </div>
            </div>

            {meeting.participants.length > 0 && (
              <div className="mt-3 flex -space-x-2 overflow-hidden">
                {meeting.participants.slice(0, 3).map((participant: { image?: string; name: string }, i: number) => (
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
        <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
          {meetingStatus.status === 'today' && (
            <Button
              className="flex-1 md:flex-none justify-center text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (meeting.meetingUrl) {
                  window.open(meeting.meetingUrl, '_blank');
                }
              }}
            >
              <ArrowUpRight className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span>Join</span>
            </Button>
          )}
          <div className="flex gap-2 flex-1 md:flex-none justify-end">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                navigator.clipboard.writeText(meeting.meetingUrl ?? '');
                toast.success('Link copied to clipboard');
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <ViewMembersModal meetingId={meeting._id} />
            <AddMemberModel meetingId={meeting._id} />
            <ScheduleMeetingModel
              mode='edit'
              meetingId={meeting._id}
              defaultValues={{ ...meeting }} />
          </div>
        </div>
      </div>
    );
  }
};

export default MeetingsPage; 