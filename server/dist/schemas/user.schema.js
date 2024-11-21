import { z } from 'zod';
const UserSchema = z.object({
    userId: z.string().uuid(),
    googleId: z.string().uuid().optional(),
    githubId: z.string().uuid().optional(),
    username: z.string().min(4).max(20),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
    password: z.string().min(8).max(20),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(200).optional(),
    refreshToken: z.string().uuid().optional(),
});
export { UserSchema };
