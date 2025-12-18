function generateName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();

  if (!name) {
    alert("Masukkan nama terlebih dahulu");
    return;
  }

  // disable tombol biar tidak spam
  const btn = document.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Generating...";

  fetch("https://liyasyntax-six.vercel.app/api/ai-name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  })
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(data => {
      document.getElementById("chineseName").innerText = data.hanzi;
      document.getElementById("pinyin").innerText = data.pinyin;
      document.getElementById("meaning").innerText = "Artinya: " + data.meaning;
      document.getElementById("descriptionText").innerText = data.description;
      document.getElementById("result").style.display = "block";
    })
    .catch(err => {
      console.error(err);
      alert("Gagal menghubungi server AI");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = "Generate";
    });
}
