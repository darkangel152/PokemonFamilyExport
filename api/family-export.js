export default async function handler(req, res) {
  try {
    const { search, language = "japanese" } = req.query;

    if (!search) {
      return res.status(400).json({ error: "Missing search parameter" });
    }

    const apiUrl = `https://www.pokemonpricetracker.com/api/v2/cards?search=${encodeURIComponent(
      search
    )}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.POKEMON_PRICE_TRACKER_API_KEY}`,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ error: `Pokémon API error: ${text}` });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({ error: "Failed to parse Pokémon API response" });
    }

    if (!data || !data.length) {
      return res.status(404).json({ error: "No cards found for this Pokémon" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
