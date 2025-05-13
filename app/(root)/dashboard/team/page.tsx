'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, Search, Shield, CheckCircle2, Clock, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const TeamPage = () => {
  const teamMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: '/avatars/01.png',
      status: 'active',
      lastActive: 'Currently active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Member',
      avatar: '/avatars/02.png',
      status: 'active',
      lastActive: '5m ago'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Member',
      avatar: '/avatars/03.png',
      status: 'offline',
      lastActive: '2h ago'
    }
  ];

  const pendingInvites = [
    {
      email: 'alex@example.com',
      role: 'Member',
      sentAt: '2 days ago',
      status: 'pending'
    }
  ];

  const getRoleStyle = (role: string) => {
    const styles = {
      Admin: 'bg-blue-50 text-blue-700 border-blue-200/50',
      Member: 'bg-gray-50 text-gray-700 border-gray-200/50',
      Owner: 'bg-purple-50 text-purple-700 border-purple-200/50'
    };
    return styles[role as keyof typeof styles] || styles.Member;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Members</h2>
          <p className="text-base text-gray-500">Manage your team and their access levels.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => { }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: '12', change: '+2 this month' },
          { label: 'Active Now', value: '8', change: '67% of members' },
          { label: 'Pending Invites', value: '3', change: 'Expires in 24h' }
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <span className="text-sm text-gray-500">{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search team members..."
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          Filter by role
        </Button>
      </div>

      {/* Team Members List */}
      <Card className="divide-y divide-gray-200 overflow-hidden bg-white">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-gray-100">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  {member.status === 'active' && (
                    <span className="flex h-2 w-2 rounded-full bg-green-400" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                  <span className="text-sm text-gray-500">{member.email}</span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{member.lastActive}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-14 sm:ml-0">
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                getRoleStyle(member.role)
              )}>
                {member.role === 'Admin' && <Shield className="mr-1 h-3 w-3" />}
                {member.role}
              </span>
              <Button variant="outline" size="sm">
                Manage Access
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Pending Invitations</h3>
          <Card className="divide-y divide-gray-200">
            {pendingInvites.map((invite, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{invite.email}</h4>
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">Invited {invite.sentAt}</span>
                      <span className="text-gray-300">•</span>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                        getRoleStyle(invite.role)
                      )}>
                        {invite.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-14 sm:ml-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Resend
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Empty State */}
      {teamMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 sm:p-12">
          <div className="rounded-full bg-gray-100 p-3">
            <UserPlus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No team members yet</h3>
          <p className="mt-1 text-center text-gray-500 max-w-sm">
            Start building your team by inviting members to collaborate.
          </p>
          <Button className="mt-6">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamPage; 