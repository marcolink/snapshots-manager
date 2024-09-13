import {z} from "zod";

export const createLinkValidation = (linkType: string) => z.object({
  type: z.literal('Link'),
  linkType: z.literal(linkType),
  id: z.string(),
})

export const TagValidation = z.object({
  sys: createLinkValidation('Tag'),
})

export const TaxonomyConceptValidation = z.object({
  sys: createLinkValidation('TaxonomyConcept'),
})

export const TagOrConceptValidation = TagValidation.or(TaxonomyConceptValidation)

export const LooseRichTextFieldValidation = z.object({
  content: z.array(z.unknown()),
  nodeType: z.literal('document'),
}).passthrough()

export const EntryValidation = z.object({
  sys: z.object({
    id: z.string(),
    type: z.literal('Entry'),
    contentType: createLinkValidation('ContentType'),
    environment: createLinkValidation('Environment'),
    space: createLinkValidation('Space'),
  }),
  fields: z.record(z.unknown()),
  metadata: z.object({
    tags: z.array(TagValidation),
    concepts: z.array(TaxonomyConceptValidation).optional(),
  })
})