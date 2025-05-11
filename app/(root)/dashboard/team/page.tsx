'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamPage = () => {
  const teamMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: '/avatars/01.png'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Member',
      avatar: '/avatars/02.png'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Member',
      avatar: '/avatars/03.png'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Team Members</h2>
          <p className="mt-1 text-gray-500">Manage your team and their access.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search team members..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Members List */}
      <Card className="divide-y divide-gray-200">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{member.role}</span>
              <Button variant="ghost" size="sm">
                Manage Access
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Pending Invitations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pending Invitations</h3>
        <Card className="divide-y divide-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">alex@example.com</h4>
                <p className="text-sm text-gray-500">Invited 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Revoke
              </Button>
              <Button size="sm">
                Resend
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {teamMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12">
          <UserPlus className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No team members yet</h3>
          <p className="mt-1 text-center text-gray-500">
            Start building your team by inviting members.
          </p>
          <Button className="mt-6">
            Invite Members
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamPage; 