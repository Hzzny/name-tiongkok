import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nama wajib diisi" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Kamu adalah ahli penamaan Mandarin. Jawab SELALU dalam format JSON."
        },
        {
          role: "user",
          content: `
Buatkan nama Mandarin dari nama "${name}".
Format JSON WAJIB seperti ini:

{
  "hanzi": "",
  "pinyin": "",
  "arti": "",
  "deskripsi": ""
}
          `
        }
      ]
    });

    const text = completion.choices[0].message.content;
    const result = JSON.parse(text);

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
