'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Video, Volume2, CreditCard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  // Add plan badge styles
  const planBadgeStyles = {
    free: 'bg-gray-100 text-gray-800',
    pro: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-blue-100 text-blue-800',
  };

  const currentPlan = 'free'; // This would come from your user's data

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-gray-500">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>
      </div>

      {/* Meeting Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Meeting Preferences</h3>
        <Card className="divide-y divide-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Default Video Settings</h4>
                <p className="text-sm text-gray-500">Start meetings with video on</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                <Volume2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Default Audio Settings</h4>
                <p className="text-sm text-gray-500">Start meetings with microphone on</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Meeting Notifications</h4>
                <p className="text-sm text-gray-500">Receive notifications for meetings</p>
              </div>
            </div>
            <Switch />
          </div>
        </Card>
      </div>

      {/* Subscription Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Subscription Management</h3>
        <Card className="divide-y divide-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Current Plan</h4>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      planBadgeStyles[currentPlan as keyof typeof planBadgeStyles]
                    )}>
                      {currentPlan}
                    </span>
                    {currentPlan === 'free' && (
                      <span className="text-xs text-gray-500">
                        • Limited features
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline">
                {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Payment Method</h4>
                  <p className="text-sm text-gray-500">Manage your payment information</p>
                </div>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Billing History</h4>
              <div className="text-sm text-gray-500">
                No billing history available
              </div>
              <Button variant="outline" className="w-full">View All Invoices</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage; 