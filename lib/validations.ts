import { z } from "zod"

export const CreatePostSchema = z.object({
  userId: z.number().int().min(1).optional(),
  uuid: z.string().min(4),
  resourceBase64: z.string().optional(),
  resourceType: z.union([z.literal("Image"), z.literal("Video")]),
  publicly: z.boolean(),
  category: z.string().min(1),
  description: z.string().max(800).optional(),
})

export type CreatePost = z.infer<typeof CreatePostSchema>;

export const username = z.string().transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const SignInSchema = z.object({
  username,
  password: z.string().min(1),
})
export type SignInDetails = z.infer<typeof SignInSchema>;

export const SignupSchema = z.object({
  username,
  password,
  role: z.union([z.literal("Normal"), z.literal("Organization")]),
  phoneNumber: z.string().min(1).max(30),
})
export type SignUpDetails = z.infer<typeof SignupSchema>;

export const UpdateProfileSchema = z.object({
  userId: z.number().int().min(1),
  username,
  password: password.optional(),
  passwordConfirmation: password.optional(),
  phoneNumber: z.string().min(1).max(30),
})
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const GetCurrentUserSchema = z.object({
  userId: z.number().int().min(1),
})
export type GetCurrentUser = z.infer<typeof GetCurrentUserSchema>;

export const CreateMessageSchema = z.object({
  userId: z.number().int().min(1),
  content: z.string().min(1).max(800),
  receiverId: z.number().int().min(1),
})
export type CreateMessage = z.infer<typeof CreateMessageSchema>;