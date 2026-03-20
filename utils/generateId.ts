export function generateId(): string {
  return `PRD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
