import {EntryProps} from "contentful-management";
import {db} from "~/database";
import {entries} from "~/database/schema";
import {WebhookActions} from "~/types";
import {streamKeyForOperation} from "~/logic/streams";
import {createHashedContent} from "~/utils/create-hashed-content";
import {createEntryPatch} from "~/utils/create-entry-patch";
import {getEntriesInPatchableRange} from "./get-entries-in-patchable-range";
import {applyEntryPatches} from "~/utils/apply-entry-patches";
import {Patch} from "generate-json-patch";
import {PERSIST_RAW_SNAPSHOT_RANGE} from "~/constants";

type Params = {
  space: string,
  environment: string,
  raw: EntryProps,
  operation: WebhookActions,
  byUser: string
}

export const createEntry = async (data: Params) => {
  console.log('-------------- createEntry --------------')

  const measure = createPerfMeasurement()
  measure.start('all')
  // console.time('get existing reference entry')
  measure.start('get_existing_reference_entry')
  const {
    distance: patchDistance,
    raw_entry: existingReferenceEntry
  } = await getExistingReferenceEntry({
    space: data.space,
    environment: data.environment,
    entry: data.raw.sys.id,
    operation: data.operation
  })
  measure.stop('get_existing_reference_entry')
  // console.timeEnd('get existing reference entry')

  const source = existingReferenceEntry ?? getDefaultReferenceEntry(data);
  const target = data.raw;
  // @ts-ignore
  const version = data.raw.sys.revision ?? data.raw.sys.version

  // write a test where we create multiple entries and check if the patchable range is correct
  // console.log(patchableRangeEntries)
  // console.log(`reference entry version: ${referenceEntry.version}, current version: ${version}`)

  measure.start('create_signature')
  // console.time('create signature')
  const signature = createHashedContent({
    fields: target.fields,
    metadata: target.metadata,
  })
  measure.stop('create_signature')
  // console.timeEnd('create signature')

  measure.start('create_patch')
  const patch = createEntryPatch({
    fields: source.fields,
    metadata: source.metadata,
  }, {
    fields: target.fields,
    metadata: target.metadata,
  });
  measure.stop('create_patch')

  const shouldSetRaw = !Boolean(existingReferenceEntry) || patchDistance >= PERSIST_RAW_SNAPSHOT_RANGE - 1
  if(shouldSetRaw) {
    console.log(`Set raw for ${data.raw.sys.id}`, {patchDistance, existingReferenceEntry: Boolean(existingReferenceEntry), shouldSetRaw})
  }

  measure.start('insert_entry')
  const insertedEntries = await  db.insert(entries).values({
    version: version,
    space: data.space,
    environment: data.environment,
    raw_entry: shouldSetRaw ? data.raw : null,
    entry: data.raw.sys.id,
    operation: data.operation,
    byUser: data.byUser,
    patch: patch,
    signature
  }).returning().execute();
  measure.stop('insert_entry')
  measure.stop('all')
  // measure.log()
  return insertedEntries
}

function getDefaultReferenceEntry(data: Params) {
  console.log('create default reference entry')
  return {...data.raw, fields: {}, metadata: {tags: []}}
}

type Result = {
  distance: number,
  raw_entry?: EntryProps,
}

async function getExistingReferenceEntry(data: {
  space: string,
  environment: string,
  entry: string,
  operation: WebhookActions,
}): Promise<Result> {
  const patchableRangeEntries = await getEntriesInPatchableRange({
    space: data.space,
    environment: data.environment,
    entry: data.entry,
    stream: streamKeyForOperation(data.operation),
    maxRange: 100
  })
  console.log('getExistingReferenceEntry::patchable range entries', patchableRangeEntries.length)
  console.table(patchableRangeEntries.map((entry) => entry.raw_entry ? 1: 0))

  if (patchableRangeEntries.length === 0) {
    console.log('getExistingReferenceEntry::no patchable range entries found')
    return {distance: Infinity}
  }

  let refEntry = patchableRangeEntries.pop()

  if (refEntry && Boolean(refEntry?.raw_entry)) {
    console.log('getExistingReferenceEntry::found reference entry', refEntry.version)
    return {
      distance: patchableRangeEntries.length,
      raw_entry: applyEntryPatches({
        entry: refEntry.raw_entry as EntryProps,
        patches: patchableRangeEntries
          .reverse()
          .map((entry) => entry.patch as Patch)
      })
    }
  } else if( patchableRangeEntries.length > 0 && Boolean(patchableRangeEntries[0].raw_entry) ) {
    console.log('getExistingReferenceEntry::FIRST ENTRY is raw', patchableRangeEntries[0].version)
      return {
        distance: patchableRangeEntries.length,
        raw_entry: patchableRangeEntries[0].raw_entry as EntryProps
    }
  } else {
    console.log('getExistingReferenceEntry::no reference entry found')
  }

  return {distance: Infinity}
}

function createPerfMeasurement() {

  const marks = new Set<string>()

  return {
    start(id: string) {
      performance.mark(`${id}_start`)
      marks.add(id)
    },
    stop(id: string) {
      if (!marks.has(id)) {
        console.warn(`Mark ${id} not started`)
      }
      performance.mark(`${id}_end`)
    },
    log(): void {
      console.table([...[...marks].map((id) => {
        const m = performance.measure(id, `${id}_start`, `${id}_end`)
        return {
          id,
          duration: m.duration
        }
      }), ])
    }
  }
}