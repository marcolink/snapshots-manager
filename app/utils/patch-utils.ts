import {Operation} from "generate-json-patch";
import {z} from "zod";
import {TagOrConceptValidation} from "~/validations/contentful";
import {FieldChange} from "~/components/PatchComponent";

export function isValueOperation(operation: Operation): operation is Operation & { value: string } {
  return operation.op === 'add' || operation.op === 'replace' || operation.op === 'copy'
}

export function createFieldChange(operation: Operation, locales: string[] = []): FieldChange[] {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]

  let locale = 'all'

  if (fieldSegments.length > 3) {
    locale = fieldSegments[3]
  }
  if (!isValueOperation(operation)) {
    return [{
      field,
      locale,
      value: null,
      operation: operation.op
    }]
  }

  if (locales.length > 0 && typeof operation.value === 'object') {
    if (fieldSegments.length > 3) {
      return [{field, locale, value: operation.value, operation: operation.op}]
    }

    const patchLocales = fieldSegments.length > 3 ? [locale] : Object.keys(operation.value).filter(locale => locales.includes(locale))

    return patchLocales.map(locale => {
      const value = typeof operation.value === 'string' ? operation.value : operation.value[locale]
      return {field, locale, value, operation: operation.op}
    })
  }

  return [{
    field,
    locale,
    value: operation.value,
    operation: operation.op
  }]
}

export type MetadataChange = {
  operation: Operation['op']
  locale?: string,
  field: string,
  value: any | z.infer<typeof TagOrConceptValidation>[]
}

export function createMetadataChange(operation: Operation): MetadataChange[] {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]
  let value = null

  if (!isValueOperation(operation)) {
    return [{
      field,
      value,
      operation: operation.op
    }]
  }

  if (operation.op === 'add' && Array.isArray(operation.value) && operation.value.length === 0) {
    return [{
      field,
      value: 'initialized',
      operation: operation.op
    }]
  }

  // function ensureStringValue(value: any) {
  //   if (typeof value === 'string') {
  //     return value
  //   }
  //   if (Array.isArray(value)) {
  //     const {success} = z.array(TagOrConceptValidation).safeParse(value)
  //     if (success) {
  //       return value.map(link => link.sys.id).join(', ')
  //     }
  //   }
  //   if (typeof value === 'object') {
  //     return JSON.stringify(value)
  //   }
  //   return JSON.stringify(value)
  // }

  return [{
    field,
    value: operation.value,
    operation: operation.op
  }]
}

