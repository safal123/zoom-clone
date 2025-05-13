import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startsAt: v.string(),
    duration: v.number(),
    isRecurring: v.boolean(),
    requireRegistration: v.boolean(),
    maxParticipants: v.optional(v.number()),
    // Required fields for Convex
    hostId: v.string(),
    hostName: v.string(),
    hostImage: v.optional(v.string()),
    streamId: v.string(),
  },
  handler: async (ctx, args) => {

    const meetingId = await ctx.db.insert("meetings", {
      streamId: args.streamId,
      title: args.title,
      description: args.description,
      startsAt: args.startsAt,
      duration: args.duration,
      isRecurring: args.isRecurring,
      requireRegistration: args.requireRegistration,
      maxParticipants: args.maxParticipants,
      hostId: args.hostId,
      hostName: args.hostName,
      hostImage: args.hostImage,
      createdAt: new Date().toISOString(),
      status: "scheduled", // scheduled, active, ended
      participants: [{
        id: args.hostId,
        name: args.hostName,
        image: args.hostImage,
        role: "host"
      }],
    });

    return { meetingId, streamId: args.streamId };
  },
});

// Get all meetings
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }
    console.log(auth);
    // get all meetings where hostId is the current user's id
    return await
      ctx
        .db
        .query("meetings")
        .filter((q) => q.eq(q.field("hostId"), auth.subject))
        // order by creation time
        .order("desc")
        .collect();
  },
});

// Update a meeting
export const update = mutation({
  args: {
    id: v.id("meetings"),
    title: v.string(),
    description: v.string(),
    startsAt: v.string(),
    duration: v.number(),
    isRecurring: v.boolean(),
    requireRegistration: v.boolean(),
    maxParticipants: v.optional(v.number()),
    streamId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }

    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);

    return { success: true };
  },
});

// Delete a meeting
export const deleteMeeting = mutation({
  args: {
    id: v.id("meetings")
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});
