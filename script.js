emailjs.init("OYiBfQ7AdLarDYc6U");

const checkboxes = document.querySelectorAll('input[name="important"]');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const checked = document.querySelectorAll(
      'input[name="important"]:checked',
    );

    if (checked.length > 3) {
      alert("Możesz wybrać maksymalnie 3 odpowiedzi.");

      e.target.checked = false;
    }
  });
});

const form = document.getElementById("recruitmentForm");

const statusDiv = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const importantChecked = document.querySelectorAll(
    'input[name="important"]:checked',
  );

  if (importantChecked.length === 0) {
    alert("Wybierz przynajmniej jedną odpowiedź.");
    return;
  }

  const advantagesChecked = document.querySelectorAll(
    'input[name="advantages"]:checked',
  );

  const otherAdvantages = document.getElementById("otherAdvantages").value;

  const advantages =
    [...advantagesChecked].map((x) => x.value).join(", ") +
    (otherAdvantages ? `, Inne: ${otherAdvantages}` : "");

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

    marketingConsent: document.getElementById("marketingConsent").checked
      ? "TAK"
      : "NIE",
  };

  statusDiv.innerHTML = "Wysyłanie formularza...";

  try {
    await emailjs.send(
      "service_mksx71m",
      "template_he9snio",
      templateParams,
      "OYiBfQ7AdLarDYc6U",
    );

    statusDiv.className = "status success";

    statusDiv.innerHTML = "✔ Formularz został wysłany poprawnie";

    form.reset();
  } catch (error) {
    statusDiv.className = "status error";

    statusDiv.innerHTML = "✖ Błąd wysyłania formularza";

    console.log(error);
  }
});

window.addEventListener("load", () => {
  const accepted = localStorage.getItem("acceptRODO");

  if (accepted === "true") {
    document.getElementById("rodoRequired").checked = true;

    localStorage.removeItem("acceptRODO");
  }
});

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
  };

  localStorage.setItem("formData", JSON.stringify(data));
}
