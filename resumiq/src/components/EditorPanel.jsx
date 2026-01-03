import { useState } from "react";

export default function EditorPanel() {
  const [name, setName] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("serif");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Resume</h2>

      <label className="block mb-2">Full Name</label>
      <input
        className="border p-2 w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block mb-2">Font Size</label>
      <input
        type="range"
        min="12"
        max="22"
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
      />

      <label className="block mt-4 mb-2">Font Style</label>
      <select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="serif">Serif</option>
        <option value="sans-serif">Sans Serif</option>
        <option value="monospace">Monospace</option>
      </select>
    </div>
  );
}
