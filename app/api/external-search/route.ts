import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const OMDB_KEY = process.env.OMDB_API_KEY;
  const TMDB_KEY = process.env.TMDB_API_KEY;

  // 1. Try OMDB
  try {
    const omdb = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(q)}&apikey=${OMDB_KEY}`);
    const data = await omdb.json();

    if (data.Response === "True" && data.Search?.length > 0) {
      const first = data.Search[0];
      const detailRes = await fetch(`https://www.omdbapi.com/?i=${first.imdbID}&plot=short&apikey=${OMDB_KEY}`);
      const d = await detailRes.json();

      let poster = d.Poster!== "N/A"? d.Poster : null;

      // 2. If no OMDB poster, try TMDB for 16:9 backdrop
      if (!poster && TMDB_KEY) {
        const tmdbSearch = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&api_key=${TMDB_KEY}`);
        const tmdbData = await tmdbSearch.json();
        if (tmdbData.results?.[0]?.backdrop_path) {
          poster = `https://image.tmdb.org/t/p/w1280${tmdbData.results[0].backdrop_path}`;
        } else if (tmdbData.results?.[0]?.poster_path) {
          poster = `https://image.tmdb.org/t/p/w780${tmdbData.results[0].poster_path}`;
        }
      }

      return NextResponse.json({
        type: "external",
        title: d.Title,
        director: d.Director,
        plot: d.Plot,
        poster,
        filmmakerNoFilms: false
      });
    }
  } catch {}

  // 3. Filmmaker hint check
  const lower = q.toLowerCase();
  if (lower.includes("christian marquez")) {
    return NextResponse.json({
      type: "external",
      filmmakerNoFilms: true,
      poster: "/no-poster.jpg"
    });
  }

  // 4. Nothing found anywhere
  return NextResponse.json({ type: "none" });
}
