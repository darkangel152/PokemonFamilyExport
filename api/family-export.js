// api/family-export.js
export default async function handler(req, res) {
  try {
    const { name, language = "japanese" } = req.query;

    if (!name) return res.status(400).json({ error: "Missing Pokémon name" });

    const apiUrl = `https://www.pokemonpricetracker.com/api/v2/cards?name=${encodeURIComponent(
      name
    )}&language=${language}`;
console.log("Fetching from API:", apiUrl);
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.POKEMON_PRICE_TRACKER_API_KEY}`,
      },
    });

if (!response.ok) {
  const text = await response.text(); // read API response
  console.error("API response error:", text);
  return res.status(response.status).json({ error: `API error: ${text}` });
}
    const data = await response.json();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
  console.log("Fetching from API:", apiUrl);
}
