export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filmId = searchParams.get("filmId");

  // Replace this with DB later (Supabase / Mongo / etc)
  const paidUsers = globalThis.paidUsers || {};

  return Response.json({
    hasAccess: !!paidUsers?.[filmId],
  });
}
