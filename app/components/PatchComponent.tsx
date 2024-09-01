import {Operation, Patch} from "generate-json-patch";

export function PatchComponent({patch}: { patch: Patch }) {

}

export type FieldChange = {
  changeTpe: Operation['op']
  locale?: string,
  field: string,
  value: string | null
}

export function createFieldChange(operation: Operation, locales: string[] = []): FieldChange[] {
  const fieldSegments = operation.path.split('/')
  const field = fieldSegments[2]

  if (!isValueOperation(operation)) {
    return [{
      field,
      locale: '',
      value: null,
      changeTpe: operation.op
    }]
  }

  if(fieldSegments.length > 3) {
    const locale = fieldSegments[3]
    return [{
      field,
      locale,
      value: operation.value,
      changeTpe: operation.op
    }]
  }

  if (locales.length > 0 && typeof operation.value === 'object') {
    const patchLocales = Object.keys(operation.value).filter(locale => locales.includes(locale))
    return patchLocales.map(locale => {
      const value = typeof operation.value === 'string' ? operation.value : operation.value[locale]
      return {field, locale, value, changeTpe: operation.op}
    })
  }

  return [{
    field,
    locale: 'unknown',
    value: operation.value,
    changeTpe: operation.op
  }]
}


function isValueOperation(operation: Operation): operation is Operation & { value: string } {
  return operation.op === 'add' || operation.op === 'replace' || operation.op === 'copy'
}