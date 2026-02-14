document.addEventListener("DOMContentLoaded", () => {

  const pages = document.querySelectorAll(".page");
  const startBtn = document.getElementById("startBtn");
  const nextBtn = document.getElementById("nextBtn");
  const applyText = document.getElementById("applyText");
  const shareBtn = document.getElementById("shareBtn");
  const photoInput = document.getElementById("photoInput");
  const photoInput2 = document.getElementById("photoInput2");

  let current = 0;
  let flipTimeout = null;

  /* =====================
     DETECT SHARE MODE
  ===================== */
  const params = new URLSearchParams(window.location.search);
  const isShare = params.get("view") === "share";

  /* =====================
     PAGE CONTROL
  ===================== */
  function showPage(index) {
    pages.forEach(p => p.classList.remove("active"));
    pages[index].classList.add("active");
    current = index;
  }

  /* =====================
     EDIT MODE
  ===================== */
  if (!isShare) {

    if (startBtn) {
      startBtn.onclick = () => showPage(1);
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (current < pages.length - 1) {
          showPage(current + 1);
        }
      };
    }

    /* ---------- TEXT ---------- */
    if (applyText) {
      applyText.onclick = () => {
        const text = document.getElementById("customText").value;
        const cardText = document.querySelector(".card-text");

        if (cardText) {
          cardText.textContent = text;
          localStorage.setItem("customText", text);
        }
      };
    }

    /* ---------- PHOTO 1 ---------- */
    if (photoInput) {
      photoInput.onchange = e => {
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem("photo1", reader.result);
          document.getElementById("photoPreview").src = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
      };
    }

    /* ---------- PHOTO 2 ---------- */
    if (photoInput2) {
      photoInput2.onchange = e => {
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem("photo2", reader.result);
          document.getElementById("photoPreview2").src = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
      };
    }
  }

  /* =====================
     SHARE BUTTON
  ===================== */
  if (shareBtn) {
    shareBtn.onclick = () => {
      const shareUrl =
        window.location.origin +
        window.location.pathname +
        "?view=share";

      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Link copied 💖\n\nSend it to someone special.");
      }).catch(() => {
        prompt("Copy this link 💌", shareUrl);
      });

      window.open(shareUrl, "_blank");
    };
  }

  /* =====================
     SHARE MODE (VIEWER)
  ===================== */
  if (isShare) {

    // esconder controles
    if (startBtn) startBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (shareBtn) shareBtn.style.display = "none";

    document.querySelectorAll(".text-editor, .upload").forEach(el => {
      el.style.display = "none";
    });

    /* ---------- RESTORE TEXT ---------- */
    const savedText = localStorage.getItem("customText");
    const cardText = document.querySelector(".card-text");
    if (savedText && cardText) {
      cardText.textContent = savedText;
    }

    /* ---------- RESTORE PHOTOS ---------- */
    const savedPhoto1 = localStorage.getItem("photo1");
    if (savedPhoto1 && document.getElementById("photoPreview")) {
      document.getElementById("photoPreview").src = savedPhoto1;
    }

    const savedPhoto2 = localStorage.getItem("photo2");
    if (savedPhoto2 && document.getElementById("photoPreview2")) {
      document.getElementById("photoPreview2").src = savedPhoto2;
    }

    /* ---------- AUTO FLIP WITH CUSTOM TIMING ---------- */
    const sequence = [
      { page: 0, time: 3000 },   // capa
      { page: 1, time: 10000 },  // texto
      { page: 2, time: 5000 },   // foto
      { page: 3, time: 7000 },   // página emocional
      { page: 4, time: 5000 }    // foto
    ];

    let index = 0;

    function playSequence() {
      const step = sequence[index];
      showPage(step.page);

      flipTimeout = setTimeout(() => {
        index++;
        if (index >= sequence.length) {
          index = 0; // 🔁 volta para capa
        }
        playSequence();
      }, step.time);
    }

    playSequence();
  }

});
