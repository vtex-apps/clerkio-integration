export async function feed(ctx: Context) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  ctx.body = params
}
