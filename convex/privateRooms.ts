import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a private room for a user
export const getOrCreate = mutation({
  args: {
    ownerId: v.string(),
    ownerName: v.string(),
    ownerImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already has a private room
    const existingRoom = await ctx.db
      .query("privateRooms")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", args.ownerId))
      .first();

    if (existingRoom) {
      // Update last accessed time
      await ctx.db.patch(existingRoom._id, {
        lastAccessedAt: Date.now(),
        ownerName: args.ownerName, // Update name in case it changed
        ownerImage: args.ownerImage, // Update image in case it changed
      });
      return existingRoom;
    }

    // Create new private room
    const streamId = `${args.ownerId.replace('user_', '')}-${Date.now()}`;
    const roomId = await ctx.db.insert("privateRooms", {
      streamId,
      ownerId: args.ownerId,
      ownerName: args.ownerName,
      ownerImage: args.ownerImage,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      isActive: false,
      title: `${args.ownerName}'s Room`,
    });

    return ctx.db.get(roomId);
  },
});

// Get a user's private room
export const get = query({
  args: {
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("privateRooms")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", args.ownerId))
      .first();
  },
});

// Update room status
export const updateStatus = mutation({
  args: {
    streamId: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("privateRooms")
      .filter((q) => q.eq(q.field("streamId"), args.streamId))
      .first();

    if (!room) throw new Error("Room not found");

    await ctx.db.patch(room._id, {
      isActive: args.isActive,
      lastAccessedAt: Date.now(),
    });
  },
}); 