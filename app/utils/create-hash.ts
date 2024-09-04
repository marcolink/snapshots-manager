import {createHash as ch} from 'node:crypto'
import {stringifySorted} from "~/utils/stringify-sorted";

export function createHash(data: unknown): string {
  return ch('sha256').update(stringifySorted(data)).digest('hex')
}