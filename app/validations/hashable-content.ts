import { z } from "zod";

export const HashableContent = z.object({
  fields: z.record(z.unknown()),
  metadata: z.record(z.unknown()),
}).strict()