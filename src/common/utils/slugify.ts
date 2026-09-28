export function slugify(text: string): string {
  if (!text) return '';

  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      // Replace accented latin chars
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9\u1780-\u17FF-]+/g, '-')
      // Collapse multiple hyphens
      .replace(/-+/g, '-')
      // Trim leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}
