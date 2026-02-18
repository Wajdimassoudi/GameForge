
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// Use cors middleware, but it's often not needed in Vercel's environment
// as it's same-origin, but good practice for local development.
app.use(cors());

//---------------------------------
// Helper: format game object
//---------------------------------
function formatGame({
  title,
  description,
  image,
  play_url = null,
  apk_url = null,
  store_url = null,
  source,
  platforms = [],
  id,
}) {
  return {
    id,
    title,
    description,
    image,
    play_url,
    apk_url,
    store_url,
    source,
    platforms,
  };
}

//=====================================
// MAIN API ROUTE
//=====================================
// The file is api/index.js, which handles requests to /api/*.
// A request to /api/games will be routed here, and Express will see the path as /games.
app.get("/games", async (req, res) => {
  // Set caching headers to improve performance.
  // s-maxage=3600: Cache on Vercel's edge network for 1 hour.
  // stale-while-revalidate=86400: If data is stale, serve it while fetching fresh data in the background for up to a day.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const games = [];

    //================================
    // 1) FreeToGame – Browser Games
    //================================
    try {
        const freeRes = await fetch("https://www.freetogame.com/api/games?platform=browser&sort-by=popularity");
        if (freeRes.ok) {
            const freeGames = await freeRes.json();
            freeGames.slice(0, 20).forEach(g => {
                games.push(
                    formatGame({
                        id: `f2g-${g.id}`,
                        title: g.title,
                        description: g.short_description,
                        image: g.thumbnail,
                        play_url: g.game_url,
                        store_url: g.game_url,
                        source: "FreeToGame",
                        platforms: ["web"]
                    })
                );
            });
        }
    } catch(e) { console.error("Failed to fetch from FreeToGame", e); }


    //================================
    // 2) F-Droid – Open Source APK Games
    //================================
    try {
        const fdroidRes = await fetch("https://f-droid.org/repo/index-v1.json");
        if (fdroidRes.ok) {
            const fdroidData = await fdroidRes.json();
            const packages = Object.values(fdroidData.packages || {})
                .filter(p => p.categories.includes('Games'))
                .slice(0, 20);

            packages.forEach(pkg => {
                const latest = pkg.packages?.[0];
                if (!latest) return;
                
                games.push(
                    formatGame({
                        id: `fdroid-${pkg.packageName}`,
                        title: pkg.name,
                        description: pkg.summary,
                        // F-Droid provides icons, but we construct a potential URL path
                        image: `https://f-droid.org/repo/icons-640/${pkg.packageName}.png`,
                        apk_url: `https://f-droid.org/repo/${latest.apkName}`,
                        store_url: `https://f-droid.org/packages/${pkg.packageName}/`,
                        source: "F-Droid",
                        platforms: ["android"]
                    })
                );
            });
        }
    } catch(e) { console.error("Failed to fetch from F-Droid", e); }


    //================================
    // 3) GitHub – Open Source Mobile Games
    //================================
    try {
        const ghRes = await fetch(
            "https://api.github.com/search/repositories?q=android+game+topic:game&sort=stars&order=desc&per_page=10"
        );
        if (ghRes.ok) {
            const ghData = await ghRes.json();
            ghData.items.forEach(repo => {
                games.push(
                    formatGame({
                        id: `gh-${repo.id}`,
                        title: repo.name,
                        description: repo.description,
                        image: repo.owner.avatar_url,
                        store_url: repo.html_url,
                        source: "GitHub",
                        platforms: ["android", "ios", "source"]
                    })
                );
            });
        }
    } catch(e) { console.error("Failed to fetch from GitHub", e); }


    //=================================
    // FINAL RESPONSE
    //=================================
    res.json({
      success: true,
      count: games.length,
      games
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch games",
      details: err.message
    });
  }
});


//=====================================
// EXPORT FOR VERCEL
//=====================================
// This makes the express app compatible with Vercel's serverless environment.
module.exports = app;
