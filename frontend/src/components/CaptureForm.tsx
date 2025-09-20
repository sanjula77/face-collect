"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CaptureForm({ fileUrl }: { fileUrl: string | null }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [gender, setGender] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setStatus("❌ You must give consent.");
      return;
    }

    if (!fileUrl) {
      setStatus("❌ No file uploaded yet.");
      return;
    }

    const { error } = await supabase.from("face_metadata").insert([
      {
        name,
        age,
        gender,
        consent,
        file_url: fileUrl,
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("❌ Failed to save metadata.");
    } else {
      setStatus("✅ Metadata saved successfully!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full max-w-md mt-4"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2"
        required
      />
      <input
        type="number"
        placeholder="Age (optional)"
        value={age || ""}
        onChange={(e) => setAge(Number(e.target.value))}
        className="border rounded p-2"
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Gender (optional)</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        I consent to my data being collected for face recognition research.
      </label>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>

      <p className="text-sm">{status}</p>
    </form>
  );
}
