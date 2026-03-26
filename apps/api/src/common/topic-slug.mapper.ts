export function toPrismaTopicSlug(slug: string): string {
  return slug.replaceAll("-", "_");
}

export function fromPrismaTopicSlug(slug: string): string {
  return slug.replaceAll("_", "-");
}
