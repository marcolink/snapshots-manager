import {createHash as ch} from 'node:crypto'

export function createHash(data: unknown): string {
  return ch('sha256').update(JSON.stringify(data)).digest('hex')
}