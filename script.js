emailjs.init("OYiBfQ7AdLarDYc6U");

/* =========================
   LIMIT 3 ODPOWIEDZI
========================= */

const importantCheckboxes = document.querySelectorAll(
  'input[name="important"]',
);

importantCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const checked = document.querySelectorAll(
      'input[name="important"]:checked',
    );

    if (checked.length > 3) {
      e.target.checked = false;

      alert("Możesz wybrać maksymalnie 3 odpowiedzi.");
    }

    saveFormState();
  });
});

/* =========================
   ZAPISYWANIE STANU
========================= */

const allInputs = document.querySelectorAll("input, textarea");

allInputs.forEach((input) => {
  input.addEventListener("input", saveFormState);

  input.addEventListener("change", saveFormState);
});

/* =========================
   FORMULARZ
========================= */

const form = document.getElementById("recruitmentForm");

const statusDiv = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* =========================
     WAŻNE
  ========================= */

  const importantChecked = document.querySelectorAll(
    'input[name="important"]:checked',
  );

  if (importantChecked.length < 1 || importantChecked.length > 3) {
    alert("Wybierz od 1 do 3 odpowiedzi.");

    return;
  }

  /* =========================
     ATUTY
  ========================= */

  const advantagesChecked = document.querySelectorAll(
    'input[name="advantages"]:checked',
  );

  const otherAdvantages = document.getElementById("otherAdvantages").value;

  const advantages =
    [...advantagesChecked].map((x) => x.value).join(", ") +
    (otherAdvantages ? `, Inne: ${otherAdvantages}` : "");

  /* =========================
     ZGODY
  ========================= */

  const rodoConsent = document.getElementById("rodoRequired").checked
    ? "TAK"
    : "NIE";

  const marketingConsent = document.getElementById("marketingConsent").checked
    ? "TAK"
    : "NIE";

  /* =========================
     PARAMETRY MAILA
  ========================= */

  const templateParams = {
    fullname: document.getElementById("fullname").value,

    phone: document.getElementById("phone").value,

    email: document.getElementById("email").value,

    idealWork: document.getElementById("idealWork").value,

    income: document.getElementById("income").value + " zł",

    finance: document.querySelector('input[name="finance"]:checked').value,

    experience: document.getElementById("experience").value,

    important: [...importantChecked].map((x) => x.value).join(", "),

    advantages: advantages,

    otherAdvantages: otherAdvantages,

    rodoConsent: rodoConsent,

    marketingConsent: marketingConsent,
  };

  statusDiv.className = "status";

  statusDiv.innerHTML = "Wysyłanie formularza...";

  /* =========================
     WYSYŁKA EMAILJS
  ========================= */

  try {
    await emailjs.send("service_mksx71m", "template_he9snio", templateParams, {
      publicKey: "OYiBfQ7AdLarDYc6U",
    });

    statusDiv.className = "status success";

    statusDiv.innerHTML = "✔ Formularz został wysłany poprawnie";

    form.reset();

    localStorage.removeItem("formData");
  } catch (error) {
    statusDiv.className = "status error";

    statusDiv.innerHTML = "✖ Błąd wysyłania formularza";

    console.log(error);
  }
});

/* =========================
   AUTO RODO
========================= */

window.addEventListener("load", () => {
  const accepted = localStorage.getItem("acceptRODO");

  if (accepted === "true") {
    document.getElementById("rodoRequired").checked = true;

    localStorage.removeItem("acceptRODO");
  }

  loadFormState();
});

/* =========================
   SAVE STATE
========================= */

function saveFormState() {
  const important = [
    ...document.querySelectorAll('input[name="important"]:checked'),
  ].map((x) => x.value);

  const advantages = [
    ...document.querySelectorAll('input[name="advantages"]:checked'),
  ].map((x) => x.value);

  const data = {
    important,

    idealWork: document.getElementById("idealWork").value,

    income: document.getElementById("income").value,

    finance: document.querySelector('input[name="finance"]:checked')?.value,

    experience: document.getElementById("experience").value,

    fullname: document.getElementById("fullname").value,

    phone: document.getElementById("phone").value,

    email: document.getElementById("email").value,

    advantages,

    otherAdvantages: document.getElementById("otherAdvantages").value,

    rodoRequired: document.getElementById("rodoRequired").checked,

    marketingConsent: document.getElementById("marketingConsent").checked,
  };

  localStorage.setItem("formData", JSON.stringify(data));
}

/* =========================
   LOAD STATE
========================= */

function loadFormState() {
  const saved = localStorage.getItem("formData");

  if (!saved) return;

  const data = JSON.parse(saved);

  /* IMPORTANT */

  if (data.important) {
    data.important.forEach((value) => {
      const checkbox = document.querySelector(
        `input[name="important"][value="${value}"]`,
      );

      if (checkbox) checkbox.checked = true;
    });
  }

  /* ADVANTAGES */

  if (data.advantages) {
    data.advantages.forEach((value) => {
      const checkbox = document.querySelector(
        `input[name="advantages"][value="${value}"]`,
      );

      if (checkbox) checkbox.checked = true;
    });
  }

  /* INPUTS */

  if (data.idealWork)
    document.getElementById("idealWork").value = data.idealWork;

  if (data.income) document.getElementById("income").value = data.income;

  if (data.experience)
    document.getElementById("experience").value = data.experience;

  if (data.fullname) document.getElementById("fullname").value = data.fullname;

  if (data.phone) document.getElementById("phone").value = data.phone;

  if (data.email) document.getElementById("email").value = data.email;

  if (data.otherAdvantages)
    document.getElementById("otherAdvantages").value = data.otherAdvantages;

  /* FINANCE */

  if (data.finance) {
    const financeRadio = document.querySelector(
      `input[name="finance"][value="${data.finance}"]`,
    );

    if (financeRadio) financeRadio.checked = true;
  }

  /* RODO */

  if (data.rodoRequired) {
    document.getElementById("rodoRequired").checked = true;
  }

  if (data.marketingConsent) {
    document.getElementById("marketingConsent").checked = true;
  }
}
