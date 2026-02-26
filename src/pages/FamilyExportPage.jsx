import React, { useState } from "react";

const FamilyExportPage = ({ fetchCards }) => {
  const [pokemonName, setPokemonName] = useState("");
  const [language, setLanguage] = useState("japanese");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // <-- error state

  const exportFamilyCSV = async () => {
    setError(""); // reset previous error
    if (!pokemonName.trim()) return setError("Please enter a Pokémon name.");

    setLoading(true);
    try {
      const initialCards = await fetchCards(pokemonName, language);

      if (!initialCards.length) {
        setError("No cards found for this Pokémon.");
        setLoading(false);
        return;
      }

      // Automatically fetch cards for all Pokémon in the same family
      const uniqueNames = [...new Set(initialCards.map(c => c.name))];
      const responses = await Promise.all(uniqueNames.map(name => fetchCards(name, language)));
      let cards = responses.flat();

      // Deduplicate
      const seen = new Set();
      cards = cards.filter(card => {
        const key = card.id || `${card.name}-${card.set}-${card.number}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Build CSV
      const headers = ["Name", "Set", "Number", "Rarity", "Market Price"];
      const rows = cards.map(c => [c.name, c.set, c.number, c.rarity || "", c.marketPrice || ""]);
      const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pokemonName.toLowerCase()}_${language}_family.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching cards. Check API key or Pokémon name.");
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

      <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: 8, marginRight: 8 }}>
        <option value="japanese">Japanese</option>
        <option value="english">English</option>
      </select>

      <button onClick={exportFamilyCSV} disabled={loading} style={{ padding: 8 }}>
        {loading ? "Exporting..." : "Export CSV"}
      </button>

      {/* Display errors inline */}
      {error && (
        <div style={{ marginTop: 20, color: "red", fontWeight: "bold" }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
};

export default FamilyExportPage;
