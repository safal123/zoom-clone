import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Start a new activity session
export const startActivity = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    activityType: v.string(),
    resourceId: v.string(),
    context: v.optional(v.object({
      location: v.optional(v.string()),
      device: v.optional(v.string()),
      platform: v.optional(v.string()),
      additionalData: v.optional(v.any()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userActivities", {
      userId: args.userId,
      userName: args.userName,
      userImage: args.userImage,
      activityType: args.activityType,
      resourceId: args.resourceId,
      startTime: new Date().toISOString(),
      events: [{
        type: "activity_start",
        timestamp: new Date().toISOString(),
      }],
      summary: {
        duration: 0,
        metrics: {},
        interactions: 0,
        status: "ongoing",
      },
      context: args.context,
    });
  },
});

// Log an event during the activity
export const logEvent = mutation({
  args: {
    activityId: v.id("userActivities"),
    eventType: v.string(),
    details: v.optional(v.any()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.activityId);
    if (!activity) throw new Error("Activity not found");

    const events = [...activity.events, {
      type: args.eventType,
      timestamp: new Date().toISOString(),
      details: args.details,
      metadata: args.metadata,
    }];

    // Update summary metrics based on event type
    const summary = { ...activity.summary };
    summary.interactions = (summary.interactions || 0) + 1;

    if (args.details?.metrics) {
      summary.metrics = {
        ...(summary.metrics || {}),
        ...args.details.metrics,
      };
    }

    await ctx.db.patch(args.activityId, {
      events,
      summary,
    });
  },
});

// End an activity and calculate final metrics
export const endActivity = mutation({
  args: {
    activityId: v.id("userActivities"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.activityId);
    if (!activity) throw new Error("Activity not found");

    const endTime = new Date().toISOString();
    const startTime = new Date(activity.startTime);
    const duration = (new Date(endTime).getTime() - startTime.getTime()) / 1000;

    await ctx.db.patch(args.activityId, {
      endTime,
      summary: {
        ...activity.summary,
        duration,
        status: args.status || "completed",
      },
      events: [...activity.events, {
        type: "activity_end",
        timestamp: endTime,
      }],
    });
  },
});

// Get activities by user
export const getByUser = query({
  args: {
    userId: v.string(),
    activityType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("userActivities")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.activityType) {
      q = q.filter((q) => q.eq(q.field("activityType"), args.activityType));
    }

    return await q
      .order("desc")
      .take(args.limit ?? 10);
  },
});

// Get activities by resource
export const getByResource = query({
  args: {
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userActivities")
      .withIndex("by_resource", (q) => q.eq("resourceId", args.resourceId))
      .collect();
  },
});

// Get activities by type
export const getByType = query({
  args: {
    activityType: v.string(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("userActivities")
      .withIndex("by_type", (q) => q.eq("activityType", args.activityType));

    if (args.startTime) {
      q = q.filter((q) => q.gte(q.field("startTime"), args.startTime!));
    }
    if (args.endTime) {
      q = q.filter((q) => q.lte(q.field("startTime"), args.endTime!));
    }

    return await q.collect();
  },
});

// Get user activity history
export const getUserHistory = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userActivities")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Helper function to calculate metrics
function calculateMetrics(events: any[]) {
  let metrics = {
    totalTimeInCall: 0,
    cameraOnTime: 0,
    micOnTime: 0,
    screenShareTime: 0,
    chatMessagesSent: 0,
    reactionsUsed: 0,
  };

  // Count chat messages
  metrics.chatMessagesSent = events.filter(e => e.type === "chat").length;

  // Count reactions
  metrics.reactionsUsed = events.filter(e => e.type === "reaction").length;

  // Calculate camera, mic, and screen share time
  let cameraLastOn: string | null = null;
  let micLastOn: string | null = null;
  let screenShareLastOn: string | null = null;

  events.forEach(event => {
    const timestamp = new Date(event.timestamp);

    switch (event.type) {
      case "camera_toggle":
        if (event.metadata?.state && !cameraLastOn) {
          cameraLastOn = event.timestamp;
        } else if (!event.metadata?.state && cameraLastOn) {
          metrics.cameraOnTime += (timestamp.getTime() - new Date(cameraLastOn).getTime()) / 1000;
          cameraLastOn = null;
        }
        break;
      case "mic_toggle":
        if (event.metadata?.state && !micLastOn) {
          micLastOn = event.timestamp;
        } else if (!event.metadata?.state && micLastOn) {
          metrics.micOnTime += (timestamp.getTime() - new Date(micLastOn).getTime()) / 1000;
          micLastOn = null;
        }
        break;
      case "screen_share":
        if (event.metadata?.state && !screenShareLastOn) {
          screenShareLastOn = event.timestamp;
        } else if (!event.metadata?.state && screenShareLastOn) {
          metrics.screenShareTime += (timestamp.getTime() - new Date(screenShareLastOn).getTime()) / 1000;
          screenShareLastOn = null;
        }
        break;
    }
  });

  // Calculate total time
  if (events.length >= 2) {
    const firstEvent = new Date(events[0].timestamp);
    const lastEvent = new Date(events[events.length - 1].timestamp);
    metrics.totalTimeInCall = (lastEvent.getTime() - firstEvent.getTime()) / 1000;
  }

  return metrics;
} 