import { createHash } from 'crypto'

interface GenerateHashArgs {
  salt: string
  key: string
  timestamp: number
}

const generateHash = ({ salt, key, timestamp }: GenerateHashArgs): string =>
  createHash('sha512')
    .update(`${salt}${key}${Math.floor(timestamp / 100)}`)
    .digest('hex')

export const compareHash = (
  clerkHash: string,
  args: GenerateHashArgs
): boolean => {
  const { salt, key, timestamp } = args

  return (
    clerkHash === generateHash({ salt, key, timestamp }) ||
    clerkHash === generateHash({ salt, key, timestamp: timestamp - 100 }) ||
    clerkHash === generateHash({ salt, key, timestamp: timestamp + 100 })
  )
}
