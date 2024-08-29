import type {Link} from "contentful-management";

export function isContentfulLink<T extends string>(input: any, linkType: T): input is Link<T> {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof input.sys === 'object' &&
    input.sys !== null &&
    input.sys.type === 'Link' &&
    input.sys.linkType === linkType
  );
}

export const isContentfulEntryLink = (input: any): input is Link<'Entry'> => isContentfulLink(input, 'Entry');
export const isContentfulAssetLink = (input: any): input is Link<'Asset'> => isContentfulLink(input, 'Asset');
export const isContentfulContentTypeLink = (input: any): input is Link<'ContentType'> => isContentfulLink(input, 'ContentType');
export const isContentfulSpaceLink = (input: any): input is Link<'Space'> => isContentfulLink(input, 'Space');
export const isContentfulEnvironmentLink = (input: any): input is Link<'Environment'> => isContentfulLink(input, 'Environment');