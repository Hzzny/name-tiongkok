import OpenAI from "openai";

const nameCache = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userName = (req.body.name || "").trim();

  if (!userName) {
    return res.status(400).json({ error: "Nama tidak boleh kosong" });
  }

  // ⭐ PENGECUALIAN KHUSUS (VIONA)
  if (userName.toLowerCase() === "viona") {
    return res.json({
      hanzi: "维奥娜",
      pinyin: "Wéi ào nà",
      meaning: "Anggun dan memiliki kedalaman makna",
      description:
        "Nama ini mencerminkan sosok yang elegan, tenang, dan misterius, dengan keindahan yang tidak mencolok namun berkesan, serta memberi kesan lembut dan berkelas."
    });
  }

  if (nameCache[userName]) {
    return res.json(nameCache[userName]);
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `
Buatkan SATU nama Mandarin untuk "${userName}".
Balas PERSIS format JSON:
{
  "hanzi": "",
  "pinyin": "",
  "meaning": "",
  "description": ""
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  const result = JSON.parse(completion.choices[0].message.content);
  nameCache[userName] = result;

  res.json(result);
}
