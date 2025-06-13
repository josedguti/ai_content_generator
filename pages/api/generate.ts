import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  result?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Invalid prompt" });
    return;
  }

  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const error = await apiRes.text();
      res.status(apiRes.status).json({ error });
      return;
    }

    const data = await apiRes.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}
