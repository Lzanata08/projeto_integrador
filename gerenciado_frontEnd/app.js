// app.js — Home: carrega médicos, pacientes e consultas do backend (sem dados estáticos)

const BASE_URL = "http://localhost:8080/api"; // mantenha consistente com as outras páginas

// ===== Utils =====
async function fetchJSON(url) {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${txt || url}`);
  }
  return res.json();
}

function setCellText(td, text) {
  td.textContent = text == null ? "-" : String(text);
}

// Pacientes: ISO date -> dd/mm/aaaa
function isoDateToBr(isoLike) {
  const s = String(isoLike || "").trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const [, yyyy, mm, dd] = m;
    return `${dd}/${mm}/${yyyy}`;
  }
  return s || "-";
}

// Consultas: "YYYY-MM-DDTHH:mm[:ss]" (sem timezone) -> local date/time
function parseIsoLocal(isoLocal) {
  if (!isoLocal || typeof isoLocal !== "string") return null;
  const parts = isoLocal.split("T");
  if (parts.length !== 2) return null;
  const d = parts[0].split("-");
  const t = parts[1].split(":");
  if (d.length < 3 || t.length < 2) return null;
  const year = parseInt(d[0], 10);
  const month = parseInt(d[1], 10) - 1;
  const day = parseInt(d[2], 10);
  const hour = parseInt(t[0], 10);
  const minute = parseInt(t[1], 10);
  let second = 0;
  if (t.length >= 3) {
    const secStr = t[2].split(".")[0];
    second = parseInt(secStr, 10) || 0;
  }
  const dt = new Date(year, month, day, hour, minute, second);
  return isNaN(dt.getTime()) ? null : dt;
}

function brDate(dt) {
  if (!dt) return "-";
  try { return dt.toLocaleDateString("pt-BR"); } 
  catch(_) { 
    const dd = String(dt.getDate()).padStart(2,"0");
    const mm = String(dt.getMonth()+1).padStart(2,"0");
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}
function brTime(dt) {
  if (!dt) return "-";
  try { return dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); } 
  catch(_) {
    const HH = String(dt.getHours()).padStart(2,"0");
    const MM = String(dt.getMinutes()).padStart(2,"0");
    return `${HH}:${MM}`;
  }
}

// ===== Estado =====
let state = {
  medicos: [],          // [{id, name, speciality}]
  pacientes: [],        // [{id, name, cpf, birthDate}]
  consultas: []         // [{id, patient:{id,name,...}, doctor:{id,name,...}, dateTime, notes}]
};

// ===== Render =====
function renderMedicos(filter = "") {
  const tbody = document.getElementById("tbody-medicos");
  if (!tbody) return;
  tbody.innerHTML = "";
  const f = filter.toLowerCase();
  const lista = !f ? state.medicos : state.medicos.filter(m =>
    (m.name||"").toLowerCase().includes(f) || (m.speciality||"").toLowerCase().includes(f)
  );

  if (lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="2" style="text-align:center; color:var(--muted);">Nenhum médico</td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach(m => {
    const tr = document.createElement("tr");
    const tdNome = document.createElement("td");
    const tdEsp  = document.createElement("td");
    setCellText(tdNome, m.name);
    setCellText(tdEsp, m.speciality);
    tr.append(tdNome, tdEsp);
    tbody.appendChild(tr);
  });
}

function renderPacientes(filter = "") {
  const tbody = document.getElementById("tbody-pacientes");
  if (!tbody) return;
  tbody.innerHTML = "";
  const f = filter.toLowerCase();
  const lista = !f ? state.pacientes : state.pacientes.filter(p => {
    const cpfNum = String(p.cpf||"").replace(/[^0-9]/g,"");
    const fNum = filter.replace(/[^0-9]/g,"");
    return (p.name||"").toLowerCase().includes(f) || cpfNum.includes(fNum) || (p.cpf||"").toLowerCase().includes(f) || (p.birthDate||"").includes(filter);
  });

  if (lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3" style="text-align:center; color:var(--muted);">Nenhum paciente</td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach(p => {
    const tr = document.createElement("tr");
    const tdNome = document.createElement("td");
    const tdNasc = document.createElement("td");
    const tdCPF  = document.createElement("td");
    setCellText(tdNome, p.name);
    setCellText(tdNasc, isoDateToBr(p.birthDate));
    setCellText(tdCPF, p.cpf);
    tr.append(tdNome, tdNasc, tdCPF);
    tbody.appendChild(tr);
  });
}

function renderConsultas(filter = "") {
  const tbody = document.getElementById("tbody-consultas");
  if (!tbody) return;
  tbody.innerHTML = "";
  const f = filter.toLowerCase();
  const lista = !f ? state.consultas : state.consultas.filter(c => {
    return String(c.id||"").toLowerCase().includes(f) ||
           (c.patient && c.patient.name || "").toLowerCase().includes(f) ||
           (c.doctor && c.doctor.name || "").toLowerCase().includes(f) ||
           (c.notes||"").toLowerCase().includes(f) ||
           (c.dateTime||"").toLowerCase().includes(f);
  });

  if (lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align:center; color:var(--muted);">Nenhuma consulta</td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach(c => {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdPac = document.createElement("td");
    const tdMed = document.createElement("td");
    const tdData = document.createElement("td");
    const tdNotas = document.createElement("td");

    const dt = parseIsoLocal(c.dateTime);
    setCellText(tdId, c.id);
    setCellText(tdPac, c.patient && c.patient.name);
    setCellText(tdMed, c.doctor && c.doctor.name);
    setCellText(tdData, dt ? `${brDate(dt)} ${brTime(dt)}` : "-");
    setCellText(tdNotas, c.notes);

    tr.append(tdId, tdPac, tdMed, tdData, tdNotas);
    tbody.appendChild(tr);
  });
}

// ===== Carregamento =====
async function carregarTudo() {
  const medicosTbody = document.getElementById("tbody-medicos");
  const pacientesTbody = document.getElementById("tbody-pacientes");
  const consultasTbody = document.getElementById("tbody-consultas");
  if (medicosTbody) medicosTbody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Carregando...</td></tr>`;
  if (pacientesTbody) pacientesTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>`;
  if (consultasTbody) consultasTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Carregando...</td></tr>`;

  try {
    const [medicos, pacientes, consultas] = await Promise.all([
      fetchJSON(`${BASE_URL}/doctors`),
      fetchJSON(`${BASE_URL}/patients`),
      fetchJSON(`${BASE_URL}/appointments`),
    ]);

    state.medicos = Array.isArray(medicos) ? medicos : [];
    state.pacientes = Array.isArray(pacientes) ? pacientes : [];
    state.consultas = Array.isArray(consultas) ? consultas : [];

    renderMedicos();
    renderPacientes();
    renderConsultas();
  } catch (err) {
    console.error("Falha ao carregar dados:", err);
    if (medicosTbody) medicosTbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#b00020;">Erro ao carregar médicos</td></tr>`;
    if (pacientesTbody) pacientesTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#b00020;">Erro ao carregar pacientes</td></tr>`;
    if (consultasTbody) consultasTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#b00020;">Erro ao carregar consultas</td></tr>`;
  }
}

// ===== Busca global =====
function wireupSearch() {
  const search = document.getElementById("globalSearch");
  if (!search) return;
  search.addEventListener("input", (e) => {
    const q = (e.target.value || "").trim().toLowerCase();
    renderMedicos(q);
    renderPacientes(q);
    renderConsultas(q);
  });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  carregarTudo();
  wireupSearch();
});
