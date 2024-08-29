import {createHash as ch} from 'node:crypto'

export function createHash(data: any): string {
  return ch('sha256').update(JSON.stringify(data)).digest('hex')
}