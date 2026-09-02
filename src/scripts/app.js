const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const now = new Date();
const form = document.querySelector("#energy-form");
const yearInput = document.querySelector("#year");
const monthInput = document.querySelector("#month");
const hoursInput = document.querySelector("#kilowatt-hours");
const displayYear = document.querySelector("#display-year");
const overview = document.querySelector("#overview");
const yearTotal = document.querySelector("#year-total");
const tableCaption = document.querySelector("#table-caption");
const allTimeTotal = document.querySelector("#all-time-total");
const summaryYear = document.querySelector("#summary-year");
const summaryYearTotal = document.querySelector("#summary-year-total");
const bestMonth = document.querySelector("#best-month");
const worstMonth = document.querySelector("#worst-month");
const annualOverview = document.querySelector("#annual-overview");
const status = document.querySelector("#status");
const supabaseClient = window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey
  ? supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey)
  : null;

async function loadEntries() {
  if (!supabaseClient) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }
  const { data, error } = await supabaseClient
    .from("monthly_energy")
    .select("year, month, kilowatt_hours");
  if (error) throw error;
  return Object.fromEntries(
    data.map((entry) => [
      `${entry.year}-${String(entry.month).padStart(2, "0")}`,
      Number(entry.kilowatt_hours),
    ]),
  );
}

function formatEnergy(value) {
  return `${value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kWh`;
}

function renderYears(entries) {
  const years = new Set([
    String(now.getFullYear()),
    ...Object.keys(entries).map((key) => key.slice(0, 4)),
  ]);
  const selectedYear = displayYear.value || String(now.getFullYear());
  displayYear.replaceChildren(
    ...[...years]
      .sort()
      .reverse()
      .map((year) => new Option(year, year, year === selectedYear, year === selectedYear)),
  );
}

async function render() {
  const entries = await loadEntries();
  renderYears(entries);
  const selectedYear = displayYear.value;
  const annualTotals = {};
  const enteredMonths = [];
  Object.entries(entries).forEach(([key, value]) => {
    const year = key.slice(0, 4);
    if (typeof value === "number" && Number.isFinite(value)) {
      annualTotals[year] = (annualTotals[year] || 0) + value;
      enteredMonths.push({ key, value });
    }
  });
  let total = 0;
  overview.replaceChildren(
    ...monthNames.map((name, index) => {
      const value = entries[`${selectedYear}-${String(index + 1).padStart(2, "0")}`];
      const numericValue = typeof value === "number" ? value : 0;
      total += numericValue;
      const row = document.createElement("tr");
      row.innerHTML = `<td>${name}</td><td class="${numericValue === 0 ? "empty" : ""}">${numericValue === 0 ? "Noch nicht eingetragen" : formatEnergy(numericValue)}</td>`;
      return row;
    }),
  );
  tableCaption.textContent = `Ertrag im Jahr ${selectedYear}`;
  yearTotal.textContent = formatEnergy(total);
  allTimeTotal.textContent = formatEnergy(
    Object.values(annualTotals).reduce((sum, value) => sum + value, 0),
  );
  summaryYear.textContent = selectedYear;
  summaryYearTotal.textContent = formatEnergy(annualTotals[selectedYear] || 0);
  annualTotals[selectedYear] = annualTotals[selectedYear] || 0;
  if (enteredMonths.length > 0) {
    const best = enteredMonths.reduce((result, entry) => (entry.value > result.value ? entry : result));
    const worst = enteredMonths.reduce((result, entry) => (entry.value < result.value ? entry : result));
    bestMonth.textContent = `${formatMonthKey(best.key)}: ${formatEnergy(best.value)}`;
    worstMonth.textContent = `${formatMonthKey(worst.key)}: ${formatEnergy(worst.value)}`;
  } else {
    bestMonth.textContent = "Noch keine Daten";
    worstMonth.textContent = "Noch keine Daten";
  }
  annualOverview.replaceChildren(
    ...Object.keys(annualTotals)
      .sort()
      .reverse()
      .map((year) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${year}</td><td>${formatEnergy(annualTotals[year])}</td>`;
        return row;
      }),
  );
}

function formatMonthKey(key) {
  const [year, month] = key.split("-");
  return `${monthNames[Number(month) - 1]} ${year}`;
}

function showError(error) {
  status.textContent = `Die Daten konnten nicht geladen werden: ${error.message}`;
}

yearInput.value = now.getFullYear();
displayYear.addEventListener("change", () => render().catch(showError));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const year = Number(yearInput.value);
  const month = Number(monthInput.value);
  const value = Number(hoursInput.value);
  const decimalPlaces = (hoursInput.value.split(".")[1] || "").length;
  if (
    !form.checkValidity() ||
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 2100 ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 999.999 ||
    decimalPlaces > 3
  ) {
    status.textContent = "Bitte gültige Werte eingeben.";
    return;
  }
  if (!supabaseClient) {
    showError(new Error("Supabase ist noch nicht konfiguriert."));
    return;
  }
  const { error } = await supabaseClient.from("monthly_energy").upsert(
    {
      year,
      month,
      kilowatt_hours: value,
    },
    { onConflict: "year,month" },
  );
  if (error) {
    showError(error);
    return;
  }
  displayYear.value = String(year);
  await render();
  status.textContent = `${monthNames[month - 1]} ${year} wurde gespeichert.`;
  hoursInput.value = "";
});

render().catch(showError);
