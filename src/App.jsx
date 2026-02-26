import React from "react";
import FamilyExportPage from "./pages/FamilyExportPage";

const App = () => {
  const fetchCards = async (name, language = "japanese") => {
    const res = await fetch(`/api/family-export?name=${encodeURIComponent(name)}&language=${language}`);
    if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status}`);
    return res.json();
  };

  return <FamilyExportPage fetchCards={fetchCards} />;
};

export default App;
