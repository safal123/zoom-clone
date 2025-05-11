import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    color: v.string(),
  }).index("by_clerk_id", ["clerkUser.id"]),

  privateRooms: defineTable({
    streamId: v.string(),
    ownerId: v.string(),
    ownerName: v.string(),
    ownerImage: v.optional(v.string()),
    createdAt: v.string(),
    isActive: v.boolean(),
    lastAccessedAt: v.optional(v.string()),
    title: v.string(),
  }).index("by_owner", ["ownerId"]),

  userActivities: defineTable({
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    activityType: v.string(), // 'video_call', 'document_edit', 'chat', 'file_share', etc.
    resourceId: v.string(), // streamId, documentId, chatId, etc.
    startTime: v.string(),
    endTime: v.optional(v.string()),
    events: v.array(v.object({
      type: v.string(),
      timestamp: v.string(),
      details: v.optional(v.any()), // Flexible field for any event-specific data
      metadata: v.optional(v.any()), // Additional context
    })),
    summary: v.object({
      duration: v.optional(v.number()), // in seconds
      metrics: v.optional(v.any()), // Flexible metrics storage as plain object
      interactions: v.optional(v.number()),
      status: v.optional(v.string()), // 'completed', 'interrupted', 'ongoing'
    }),
    context: v.optional(v.object({
      location: v.optional(v.string()),
      device: v.optional(v.string()),
      platform: v.optional(v.string()),
      additionalData: v.optional(v.any()),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_resource", ["resourceId"])
    .index("by_type", ["activityType"])
    .index("by_time", ["startTime"]),

  meetings: defineTable({
    streamId: v.string(),
    title: v.string(),
    description: v.string(),
    startsAt: v.string(),
    hostId: v.string(),
    hostName: v.string(),
    hostImage: v.optional(v.string()),
    createdAt: v.string(),
    status: v.string(),
    participants: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
        role: v.string()
      })
    ),
  })
});