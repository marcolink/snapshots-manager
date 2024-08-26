import {z} from "zod";

const HTTPRequest: {
  GET: z.ZodObject<{ method: z.ZodLiteral<"GET"> }>;
  POST: z.ZodObject<{ method: z.ZodLiteral<"POST"> }>;
} = {
  GET: z.object({
    method: z.literal('GET'),
  }),
  POST: z.object({
    method: z.literal('POST'),
  }),
}
