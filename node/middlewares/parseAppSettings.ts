import { validateAppSettings } from '../utils'
import { normalizeAppSettings } from '../utils/normalizeAppSettings'

export async function parseAppSetings(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { apps },
  } = ctx

  const appConfig: AppConfig = await apps.getAppSettings(
    process.env.VTEX_APP_ID as string
  )

  const normalizedAppSettings = await normalizeAppSettings(appConfig, ctx)

  validateAppSettings(normalizedAppSettings)

  ctx.state.appConfig = normalizedAppSettings

  await next()
}
