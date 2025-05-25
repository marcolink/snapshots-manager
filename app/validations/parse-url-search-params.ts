import {z} from "zod";

export function parseURLSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  params: URLSearchParams,
) {
  const data: Record<string, string[] | string | undefined> = {};

  for (const key of params.keys()) {
    const value = params.getAll(key).filter(v => v !== String(undefined));
    if (value.length > 1) data[key] = value;
    else data[key] = value.at(0);
  }

  return schema.parse(data) as z.infer<T>;
}