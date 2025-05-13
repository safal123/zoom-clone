'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Users, Crown, UserMinus, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

export type ViewMembersModalRef = {
  open: () => void;
  close: () => void;
};

interface ViewMembersModalProps {
  meetingId: string;
  trigger?: React.ReactNode;
}

type ParticipantRoleAPI = "co-host" | "presenter" | "viewer";

type ParticipantRole = ParticipantRoleAPI | "host";

interface Participant {
  id: string;
  name: string;
  image?: string;
  role: string;
  email?: string;
}

const ViewMembersModal = forwardRef<ViewMembersModalRef, ViewMembersModalProps>(
  ({ meetingId, trigger }, ref) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const meeting = useQuery(api.meetings.getById, {
      id: meetingId as unknown as Id<"meetings">
    });

    const removeParticipant = useMutation(api.meetings.removeParticipant);
    const updateParticipantRole = useMutation(api.meetings.updateParticipantRole);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const filteredParticipants = meeting?.participants?.filter((participant: Participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (participant.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      participant.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleRemoveParticipant = async (participantId: string) => {
      try {
        await removeParticipant({
          meetingId: meetingId as unknown as Id<"meetings">,
          participantId
        });
        toast.success('Participant removed');
      } catch (error) {
        console.error('Failed to remove participant:', error);
        toast.error('Failed to remove participant');
      }
    };

    const handleChangeRole = async (participantId: string, newRole: ParticipantRoleAPI) => {
      try {
        await updateParticipantRole({
          meetingId: meetingId as unknown as Id<"meetings">,
          participantId,
          role: newRole
        });
        toast.success('Role updated');
      } catch (error) {
        console.error('Failed to update role:', error);
        toast.error('Failed to update role');
      }
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    };

    const getRoleBadgeStyle = (role: string) => {
      switch (role) {
        case 'host':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'co-host':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'presenter':
          return 'bg-green-100 text-green-800 border-green-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const isCurrentUserHost = true;

    if (!meeting) {
      return null;
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Meeting Participants</DialogTitle>
            <DialogDescription>
              {filteredParticipants.length} participants in this meeting
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search participants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[350px] overflow-y-auto space-y-2">
            {filteredParticipants.map((participant: Participant) => (
              <div key={participant.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={participant.image} alt={participant.name} />
                    <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {participant.name}
                      {participant.role === 'host' && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.email || participant.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(getRoleBadgeStyle(participant.role))}>
                    {participant.role}
                  </Badge>

                  {participant.role !== 'host' && isCurrentUserHost && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Manage Participant</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangeRole(participant.id, 'co-host')}>
                          Make Co-host
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(participant.id, 'presenter')}>
                          Make Presenter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(participant.id, 'viewer')}>
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleRemoveParticipant(participant.id)}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}

            {filteredParticipants.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No participants found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

ViewMembersModal.displayName = "ViewMembersModal";

export default ViewMembersModal;