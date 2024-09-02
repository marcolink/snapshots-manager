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