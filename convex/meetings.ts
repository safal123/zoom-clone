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
      status: "scheduled",
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

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }
    console.log(auth);
    return await
      ctx
        .db
        .query("meetings")
        .filter((q) => q.eq(q.field("hostId"), auth.subject))
        .order("desc")
        .collect();
  },
});

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

export const deleteMeeting = mutation({
  args: {
    id: v.id("meetings")
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }

    const meeting = await ctx.db.get(args.id);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.hostId !== auth.subject) {
      throw new Error("Only the host can delete the meeting");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const addParticipant = mutation({
  args: {
    meetingId: v.id("meetings"),
    participant: v.object({
      email: v.string(),
      name: v.string(),
      role: v.union(v.literal("viewer"), v.literal("presenter"), v.literal("co-host")),
    }),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }

    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.hostId !== auth.subject) {
      const isCoHost = meeting.participants.some(
        p => p.id === auth.subject && p.role === "co-host"
      );

      if (!isCoHost) {
        throw new Error("Only hosts and co-hosts can add participants");
      }
    }

    const existingParticipant = meeting.participants.find(
      p => p.id === args.participant.email || p.name === args.participant.name
    );

    if (existingParticipant) {
      throw new Error("Participant already exists in this meeting");
    }

    const updatedParticipants = [
      ...meeting.participants,
      {
        id: args.participant.email,
        name: args.participant.name,
        image: undefined,
        role: args.participant.role
      }
    ];

    await ctx.db.patch(args.meetingId, {
      participants: updatedParticipants
    });

    return { success: true };
  },
});

export const getById = query({
  args: {
    id: v.id("meetings")
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }

    const meeting = await ctx.db.get(args.id);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    const isUserInMeeting = meeting.participants.some(p => p.id === auth.subject);
    if (!isUserInMeeting && meeting.hostId !== auth.subject) {
      throw new Error("You don't have access to this meeting");
    }

    return meeting;
  },
});

export const removeParticipant = mutation({
  args: {
    meetingId: v.id("meetings"),
    participantId: v.string()
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }

    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.hostId !== auth.subject) {
      const isCoHost = meeting.participants.some(
        p => p.id === auth.subject && p.role === "co-host"
      );

      if (!isCoHost) {
        throw new Error("Only hosts and co-hosts can remove participants");
      }
    }

    const participantToRemove = meeting.participants.find(p => p.id === args.participantId);
    if (!participantToRemove) {
      throw new Error("Participant not found");
    }

    if (participantToRemove.role === "host") {
      throw new Error("Cannot remove the host");
    }

    const updatedParticipants = meeting.participants.filter(
      p => p.id !== args.participantId
    );

    await ctx.db.patch(args.meetingId, {
      participants: updatedParticipants
    });

    return { success: true };
  },
});

export const updateParticipantRole = mutation({
  args: {
    meetingId: v.id("meetings"),
    participantId: v.string(),
    role: v.union(
      v.literal("viewer"),
      v.literal("presenter"),
      v.literal("co-host")
    )
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("Unauthorized");
    }

    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.hostId !== auth.subject) {
      throw new Error("Only hosts can update participant roles");
    }

    const participantIndex = meeting.participants.findIndex(
      p => p.id === args.participantId
    );

    if (participantIndex === -1) {
      throw new Error("Participant not found");
    }

    const updatedParticipants = [...meeting.participants];

    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      role: args.role
    };

    await ctx.db.patch(args.meetingId, {
      participants: updatedParticipants
    });

    return { success: true };
  },
});
