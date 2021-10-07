import { parse } from 'querystring'
import { createHash } from 'crypto'

const key = 'wCDOCYsZ5RHlLLZjOUUUnrtTa1cTmf8CezvcZgrn3h'

export async function clerkAuth(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: {
      route: { params },
    },
    querystring,
  } = ctx

  const unixTimestamp = Date.now()

  // eslint-disable-next-line no-console
  console.log({ unixTimestamp })

  const { bindingId } = params

  if (bindingId) {
    const { salt, hash } = parse(querystring)

    // eslint-disable-next-line no-console
    console.log({ salt, hash })

    const hash512 = createHash('sha512')
    const hashed = hash512
      .update(`${salt}${key}${Math.floor(unixTimestamp / 100)}`)
      .digest('hex')

    // eslint-disable-next-line no-console
    console.log({ hashed })

    ctx.status = 200

    return
  }

  await next()
}
