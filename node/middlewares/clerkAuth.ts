import { parse } from 'querystring'

import { AuthenticationError, UserInputError } from '@vtex/api'

import { compareHash } from '../utils/hash'

export async function clerkAuth(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: {
      route: { params },
    },
    querystring,
    state: {
      appConfig: { settings },
    },
  } = ctx

  // timestamp in seconds
  const timestamp = Date.now() / 1000
  const { bindingId } = params
  const { salt, hash } = parse(querystring) as { salt: string; hash: string }

  if (!salt || !hash) {
    throw new UserInputError(`Missing salt ${salt} or hash ${hash} params`)
  }

  const appSettings = settings.find(setting => setting.bindingId === bindingId)

  if (!appSettings) {
    throw new UserInputError(
      `Binding sent on url params ${bindingId} does not match any in the app settings. Please review Clerk URL or app settings.`
    )
  }

  const { clerkioToken } = appSettings

  const isAuth = compareHash(hash, { salt, timestamp, key: clerkioToken })

  if (!isAuth) {
    throw new AuthenticationError('Unauthorized')
  }

  await next()
}
