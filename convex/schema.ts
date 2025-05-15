import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    color: v.string(),
  })
    .index("by_clerk_id", ["clerkUser.id"]),

  privateRooms: defineTable({
    streamId: v.string(),
    ownerId: v.string(),
    ownerName: v.string(),
    ownerImage: v.optional(v.string()),
    createdAt: v.number(),
    isActive: v.boolean(),
    lastAccessedAt: v.optional(v.number()),
    title: v.string(),
  }).index("by_owner_id", ["ownerId"]),

  userActivities: defineTable({
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    activityType: v.union(
      v.literal("video_call"),
      v.literal("document_edit"),
      v.literal("chat"),
      v.literal("file_share")
    ),
    resourceId: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    events: v.array(v.object({
      type: v.string(),
      timestamp: v.number(),
      details: v.optional(v.object({})),
      metadata: v.optional(v.object({})),
    })),
    summary: v.object({
      duration: v.optional(v.number()),
      metrics: v.optional(v.object({})),
      interactions: v.optional(v.number()),
      status: v.optional(v.union(
        v.literal("completed"),
        v.literal("interrupted"),
        v.literal("ongoing")
      )),
    }),
    context: v.optional(v.object({
      location: v.optional(v.string()),
      device: v.optional(v.string()),
      platform: v.optional(v.string()),
      additionalData: v.optional(v.object({})),
    })),
  })
    .index("by_user_id", ["userId"])
    .index("by_resource_id", ["resourceId"])
    .index("by_activity_type", ["activityType"])
    .index("by_start_time", ["startTime"]),

  meetings: defineTable({
    streamId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),

    startsAt: v.number(),
    endsAt: v.optional(v.number()),
    createdAt: v.number(),

    type: v.union(
      v.literal("scheduled"),
      v.literal("instant"),
      v.literal("recurring")
    ),
    status: v.union(
      v.literal("scheduled"),
      v.literal("inProgress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),

    hostId: v.string(),
    hostName: v.string(),
    hostImage: v.optional(v.string()),

    isRecurring: v.boolean(),
    requireRegistration: v.boolean(),
    maxParticipants: v.optional(v.number()),
    meetingUrl: v.optional(v.string()),

    recurringPattern: v.optional(v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("biweekly"),
      v.literal("monthly")
    )),
    recurringDaysOfWeek: v.optional(v.array(v.number())),
    recurringInterval: v.optional(v.number()),
    recurringEndDate: v.optional(v.number()),
    recurringCount: v.optional(v.number()),

    participants: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        email: v.optional(v.string()),
        image: v.optional(v.string()),
        role: v.union(
          v.literal("host"),
          v.literal("co-host"),
          v.literal("participant"),
          v.literal("observer")
        ),
        joinedAt: v.optional(v.number()),
        leftAt: v.optional(v.number()),
        isActive: v.boolean(),
        totalTimePresent: v.optional(v.number()),
        registrationStatus: v.optional(v.union(
          v.literal("registered"),
          v.literal("attended"),
          v.literal("no-show"),
          v.literal("cancelled")
        )),
        feedback: v.optional(v.object({
          rating: v.optional(v.number()),
          comments: v.optional(v.string()),
        })),
      })
    ),

    settings: v.object({
      allowRecording: v.boolean(),
      allowChat: v.boolean(),
      allowScreenShare: v.boolean(),
      muteOnEntry: v.boolean(),
      waitingRoom: v.boolean(),
      password: v.optional(v.string()),
    }),

    recordings: v.optional(v.array(
      v.object({
        id: v.string(),
        url: v.string(),
        duration: v.number(),
        createdAt: v.number(),
        fileSize: v.optional(v.number()),
      })
    )),

    analytics: v.optional(v.object({
      totalDuration: v.optional(v.number()),
      peakParticipantCount: v.optional(v.number()),
      averageParticipantCount: v.optional(v.number()),
    })),
  })
    .index("by_host_id", ["hostId"])
    .index("by_stream_id", ["streamId"])
    .index("by_status_and_starts_at", ["status", "startsAt"])
    .index("by_type_and_starts_at", ["type", "startsAt"])
    .index("by_starts_at", ["startsAt"]),
});