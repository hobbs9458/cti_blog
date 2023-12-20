"use client";

import { useState, useEffect } from "react";

// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function VendingFormSubmission() {
  const [item, setItem] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  // const supabase = createClientComponentClient(cookieStore);

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   const { error } = await supabase
  //     .from("TEST")
  //     .insert([{ Item: item, Min: min, Max: max }]);

  //   if (error) console.log("Error: ", error);
  // }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/api/vending-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item,
        min,
        max,
      }),
    });

    const data = res.json();
    if (data.error) {
      console.log(data.error.message);
    }
    if (data.data) {
      console.log(data.data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="item" className="label">
        Item
      </label>
      <input
        type="text"
        id="item"
        className="input"
        onChange={(e) => setItem(e.target.value)}
        value={item}
      />

      <label htmlFor="min" className="label">
        Min
      </label>
      <input
        type="number"
        name="min"
        id="min"
        className="label"
        onChange={(e) => setMin(e.target.value)}
        value={min}
      />

      <label htmlFor="max" className="label">
        Max
      </label>
      <input
        type="number"
        name="max"
        id="max"
        className="label"
        onChange={(e) => setMax(e.target.value)}
        value={max}
      />
      <button>Submit</button>
    </form>
  );
}
