import React, { useState } from "react";

const fetchCards = async (pokemonName, language = "japanese") => {
  const url = `/api/family-export?search=${encodeURIComponent(pokemonName)}&language=${language}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch cards: ${res.status}`);
  }

  return res.json();
};

const FamilyExportPage = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [language, setLanguage] = useState("japanese");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exportFamilyCSV = async () => {
    setError("");
    const name = pokemonName.trim();
    if (!name) return setError("Please enter a Pokémon name.");

    setLoading(true);
    try {
      const cards = await fetchCards(name, language);

      if (!cards.length) {
        setError("No cards found for this Pokémon.");
        setLoading(false);
        return;
      }

      const headers = ["Name", "Set", "Number", "Rarity", "Market Price"];
      const rows = cards.map(c => [
        c.name,
        c.set,
        c.number,
        c.rarity || "",
        c.marketPrice || "",
      ]);

      const csvContent = [headers, ...rows]
        .map(r => r.map(v => `"${v}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name.toLowerCase()}_${language}_family.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", minHeight: "100vh" }}>
      <h1>Pokémon Family Export</h1>

      <input
        placeholder="Enter Pokémon name"
        value={pokemonName}
        onChange={e => setPokemonName(e.target.value)}
        style={{ padding: 8, marginRight: 8 }}
      />

      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        style={{ padding: 8, marginRight: 8 }}
      >
        <option value="japanese">Japanese</option>
        <option value="english">English</option>
      </select>

      <button onClick={exportFamilyCSV} disabled={loading} style={{ padding: 8 }}>
        {loading ? "Exporting..." : "Export CSV"}
      </button>

      {error && (
        <div style={{ marginTop: 20, color: "red", fontWeight: "bold" }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
};

export default FamilyExportPage;
