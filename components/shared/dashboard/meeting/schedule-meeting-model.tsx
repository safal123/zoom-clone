'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { toast } from 'sonner';
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, 'Please select a start time'),
  duration: z.number().min(1, 'Please select duration'),
  isRecurring: z.boolean(),
  requireRegistration: z.boolean(),
  maxParticipants: z.number().optional(),
  streamId: z.string().optional(),
});

export type ScheduleMeetingModelRef = {
  open: () => void;
  close: () => void;
};

const ScheduleMeetingModel = forwardRef<
  ScheduleMeetingModelRef,
  {
    defaultValues?: any;
    mode?: 'create' | 'edit';
    meetingId?: string;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
  }
>(({
  defaultValues,
  mode = 'create',
  meetingId,
  onSuccess,
  trigger
}, ref) => {
  const createMeeting = useMutation(api.meetings.create);
  const updateMeeting = useMutation(api.meetings.update);
  const deleteMeeting = useMutation(api.meetings.deleteMeeting);

  const { user } = useUser();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false)
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      time: '',
      duration: 30,
      isRecurring: false,
      requireRegistration: false,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && meetingId) {
      setOpen(true);
    }
  }, [mode, meetingId]);

  useEffect(() => {
    if (mode === 'edit' && defaultValues) {
      // If we have a startsAt string in ISO format, convert it to separate date and time fields
      if (defaultValues.startsAt && typeof defaultValues.startsAt === 'string') {
        try {
          const date = new Date(defaultValues.startsAt);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const time = `${hours}:${minutes}`;

          form.reset({
            ...defaultValues,
            date: date,
            time: time
          });
        } catch (error) {
          console.error('Error parsing date:', error);
          form.reset(defaultValues);
        }
      } else {
        form.reset(defaultValues);
      }
    }
  }, [form, defaultValues, mode]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const startsAt = new Date(values.date);
      const [hours, minutes] = values.time.split(':');
      startsAt.setHours(parseInt(hours), parseInt(minutes));

      const meetingData = {
        title: values.title,
        description: values.description,
        startsAt: startsAt.toISOString(),
        duration: values.duration,
        isRecurring: values.isRecurring,
        requireRegistration: values.requireRegistration,
        maxParticipants: values.maxParticipants,
        hostId: user?.id || '',
        hostName: user?.fullName || '',
        hostImage: user?.imageUrl,
        streamId: mode === 'edit' ? defaultValues?.streamId || `${user?.id}-${Date.now()}` : `${user?.id}-${Date.now()}`,
      };

      if (mode === 'create') {
        await createMeeting(meetingData);
        toast.success('Meeting created successfully');
      } else if (mode === 'edit' && meetingId) {
        try {
          const updateData = {
            id: meetingId as unknown as Id<"meetings">,
            title: meetingData.title,
            description: meetingData.description,
            startsAt: meetingData.startsAt,
            duration: meetingData.duration,
            isRecurring: meetingData.isRecurring,
            requireRegistration: meetingData.requireRegistration,
            maxParticipants: meetingData.maxParticipants,
            streamId: meetingData.streamId
          };

          await updateMeeting(updateData);
          toast.success('Meeting updated successfully');
        } catch (error) {
          console.error('Error updating meeting:', error);
          toast.error('Failed to update meeting');
        }
      }

      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(`Failed to ${mode} meeting:`, error);
      toast.error(`Failed to ${mode} meeting`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!meetingId) return;

    try {
      setIsDeleting(true);
      // Properly convert string ID to Convex ID
      await deleteMeeting({
        id: meetingId as unknown as Id<"meetings">
      });
      toast.success('Meeting deleted successfully');
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      toast.error('Failed to delete meeting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === 'create' ? "outline" : "ghost"}>
            {mode === 'create' ? 'Schedule Meeting' : 'Edit'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Schedule New Meeting' : 'Edit Meeting'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? "Set up your meeting details. Click schedule when you're done."
              : "Update your meeting details. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly Team Sync" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 pointer-events-auto"
                        align="start"
                        side="bottom"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            // Close the popover after selection
                            const popoverTrigger = document.activeElement as HTMLElement;
                            popoverTrigger?.blur();
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 24 * 2 }).map((_, i) => {
                          const hour = Math.floor(i / 2);
                          const minute = i % 2 === 0 ? '00' : '30';
                          const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[15, 30, 45, 60, 90, 120].map((minutes) => (
                        <SelectItem key={minutes} value={minutes.toString()}>
                          {minutes} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Meeting agenda and details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recurring Meeting</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    Create a recurring schedule
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Registration</Label>
                  <div className="text-[0.8rem] text-muted-foreground">
                    Participants must register before joining
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="requireRegistration"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty for unlimited participants
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-between">
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isLoading}
                >
                  {isDeleting ? "Deleting..." : "Delete Meeting"}
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? (mode === 'create' ? "Creating..." : "Updating...")
                  : (mode === 'create' ? "Schedule Meeting" : "Update Meeting")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

ScheduleMeetingModel.displayName = "ScheduleMeetingModel";

export default ScheduleMeetingModel;
