export const ensureSingleWordClass = (
  className: string | undefined
): string | undefined => {
  return className?.split(' ').join('-')
}
