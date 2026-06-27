import { NextResponse } from "next/server";

const OMDB_KEY = "4eabcd68"; // TODO: Move to.env.local for prod

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  // 1. Try OMDB
  try {
    const omdb = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(q)}&apikey=${OMDB_KEY}`);
    const data = await omdb.json();

    if (data.Response === "True" && data.Search?.length > 0) {
      const first = data.Search[0];
      const detailRes = await fetch(`https://www.omdbapi.com/?i=${first.imdbID}&plot=short&apikey=${OMDB_KEY}`);
      const d = await detailRes.json();

      const poster = d.Poster!== "N/A"? d.Poster : "/no-poster.jpg";

      return NextResponse.json({
        type: "external",
        title: d.Title,
        director: d.Director,
        plot: d.Plot,
        poster,
        filmmakerNoFilms: false
      });
    }
  } catch (e) {
    console.error("OMDB error", e);
  }

  // 2. Filmmaker hint check
  const lower = q.toLowerCase();
  if (lower.includes("christian marquez")) {
    return NextResponse.json({
      type: "external",
      filmmakerNoFilms: true,
      poster: "/no-poster.jpg"
    });
  }

  // 3. Nothing found anywhere
  return NextResponse.json({ type: "none" });
}
