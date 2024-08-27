export const toRecord = (headers: Headers | URLSearchParams) => {
  return Object.fromEntries(Array.from(headers.entries()));
}