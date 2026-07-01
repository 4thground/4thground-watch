import { NextRequest } from 'next/server';

// 1. Type it so TS stops crying
declare global {
  var paidUsers: Record<string, boolean> | undefined;
}

const paidUsers = global.paidUsers || (global.paidUsers = {});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filmId = searchParams.get('filmId');
  
  // Replace this with DB later - Supabase / Mongo / etc
  return Response.json({
    hasAccess: !!paidUsers[filmId!],
  });
}
