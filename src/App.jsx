import React from "react";
import FamilyExportPage from "./pages/FamilyExportPage";

const fetchCards = async (pokemonName, language = "japanese") => {
  const res = await fetch(
    `/api/family-export?search=${encodeURIComponent(pokemonName)}&language=${language}`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch cards: ${res.status}`);
  }
  return res.json();
};

export default App;
