import {z} from "zod";

const RawScopedQueryParams = z.object({
  space: z.string(),
  environment: z.string().optional(),
  environmentAlias: z.string().optional(),
  entry: z.string(),
});

export const ScopedQueryParams = RawScopedQueryParams.transform((data) => ({
  space: data.space,
  environment: data.environmentAlias ?? data.environment ?? "", // Fallback to empty string if neither is provided
  entry: data.entry,
})).refine((data) => !!data.environment, {
  message: "An environment or environmentAlias must be provided.",
});

export type ScopedQueryParamsType = z.infer<typeof ScopedQueryParams>