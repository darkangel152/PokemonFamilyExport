// api/family-export.js
export default async function handler(req, res) {
  try {
    const { name, language = "japanese" } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Missing Pokémon name" });
    }

    const apiUrl = `https://www.pokemonpricetracker.com/api/v2/cards?name=${encodeURIComponent(
      name
    )}&language=${language}`;

    console.log("Fetching from Pokémon API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.POKEMON_PRICE_TRACKER_API_KEY}`,
      },
    });

    const text = await response.text(); // read response as text first
    if (!response.ok) {
      console.error("Pokémon API returned error:", text);
      return res.status(response.status).json({
        error: `Pokémon API error: ${text}`,
        status: response.status,
      });
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("Error parsing Pokémon API response:", text);
      return res.status(500).json({ error: "Failed to parse Pokémon API response" });
    }

    if (!data || !data.length) {
      return res.status(404).json({ error: "No cards found for this Pokémon" });
    }

    // Return JSON to frontend
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
