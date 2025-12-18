import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 Cache sederhana (nama sama → hasil sama)
const nameCache = {};

app.post("/ai-name", async (req, res) => {
  try {
    const userName = (req.body.name || "").trim();

    if (!userName) {
      return res.status(400).json({ error: "Nama tidak boleh kosong" });
    }
        // ⭐ PENGECUALIAN KHUSUS
    if (userName.toLowerCase() === "viona") {
      return res.json({
        hanzi: "维奥娜",
        pinyin: "Wéi ào nà",
        meaning: "Anggun dan memiliki kedalaman makna",
        description:
          "Nama ini mencerminkan sosok yang elegan, tenang, dan misterius, dengan keindahan yang tidak mencolok namun berkesan, serta memberi kesan lembut dan berkelas."
      });
    }

    // ✅ Kalau nama sudah pernah digenerate
    if (nameCache[userName]) {
      return res.json(nameCache[userName]);
    }

    // 🧾 Prompt AI (disesuaikan dengan web kamu)
    const prompt = `
Buatkan SATU nama Mandarin yang cocok untuk nama "${userName}".

WAJIB balas dalam format JSON PERSIS seperti ini:
{
  "hanzi": "",
  "pinyin": "",
  "meaning": "",
  "description": ""
}

Ketentuan:
- Pinyin WAJIB pakai tanda nada
- Meaning dan description dalam Bahasa Indonesia
- Nama harus terdengar alami dan sopan
- Konsisten untuk nama yang sama
- Jangan beri teks tambahan apa pun
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2 // 🔒 lebih konsisten
    });

    const text = completion.choices[0].message.content;

    // 🛡️ Parsing aman
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Format AI tidak valid" });
    }

    // 💾 Simpan ke cache
    nameCache[userName] = result;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal generate nama AI" });
  }
});

// 🚀 Jalankan server
app.listen(3000, () => {
  console.log("✅ AI server jalan di http://localhost:3000");
});
