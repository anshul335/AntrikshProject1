import { z } from "zod";

// Task Schema
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "done"]),
  dueDate: z.string().optional(),
  createdAt: z.string(),
});

export const insertTaskSchema = taskSchema.omit({ id: true, createdAt: true });

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Message Schema
export const messageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  subject: z.string(),
  preview: z.string(),
  content: z.string(),
  timestamp: z.string(),
  isRead: z.boolean(),
});

export const insertMessageSchema = messageSchema.omit({ id: true });

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Integration Schema
export const integrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  isConnected: z.boolean(),
});

export type Integration = z.infer<typeof integrationSchema>;

// Activity Schema
export const activitySchema = z.object({
  id: z.string(),
  action: z.string(),
  description: z.string(),
  timestamp: z.string(),
});

export type Activity = z.infer<typeof activitySchema>;

// Settings Schema
export const settingsSchema = z.object({
  darkMode: z.boolean(),
  notifications: z.boolean(),
  profileName: z.string(),
  profileEmail: z.string(),
});

export type Settings = z.infer<typeof settingsSchema>;
