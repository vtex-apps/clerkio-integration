import { validateAppSettings } from '../utils'

export async function parseAppSetings(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { apps },
  } = ctx

  const appConfig: AppConfig = await apps.getAppSettings(
    process.env.VTEX_APP_ID as string
  )

  validateAppSettings(appConfig)

  ctx.state.appConfig = appConfig

  await next()
}
