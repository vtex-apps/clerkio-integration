export async function vtexAuth(ctx: Context, next: () => Promise<void>) {
  ctx.set('Cache-Control', 'no-cache, no-store')

  ctx.state.isVtex = true

  await next()
}
