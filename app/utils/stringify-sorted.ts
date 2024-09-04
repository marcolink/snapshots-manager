export function stringifySorted(obj: any): string {
  if (typeof obj !== 'object' || obj === null) {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return JSON.stringify(obj.map((item) => stringifySorted(item)));
  }

  const sortedObj: Record<string, string> = {};
  const sortedKeys = Object.keys(obj).sort();

  sortedKeys.forEach((key) => {
    sortedObj[key] = stringifySorted(obj[key]);
  });

  return JSON.stringify(sortedObj);
}