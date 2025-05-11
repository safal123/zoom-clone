import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    streamId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startsAt: v.string(),
    hostId: v.string(),
    hostName: v.string(),
    hostImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const meetingId = await ctx.db.insert("meetings", {
      streamId: args.streamId,
      title: args.title || "Untitled Meeting",
      description: args.description || "",
      startsAt: args.startsAt,
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
      }]
    });

    return meetingId;
  },
});
