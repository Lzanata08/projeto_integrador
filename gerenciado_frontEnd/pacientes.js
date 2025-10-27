// ===== Integração CRUD de Pacientes (jQuery) =====
// Endpoints reais (evite barra final em POST/PUT/DELETE):
// GET  /api/patients
// GET  /api/patients/{id}
// POST /api/patients
// PUT  /api/patients/{id}
// DELETE /api/patients/{id}

const BASE_URL = "http://localhost:8080/api"; // ajuste se sua API estiver em outra origem/porta

const API = {
  list: () => $.ajax({ url: `${BASE_URL}/patients`, method: "GET" }),
  get: (id) => $.ajax({ url: `${BASE_URL}/patients/${encodeURIComponent(id)}`, method: "GET" }),
  create: (data) =>
    $.ajax({
      url: `${BASE_URL}/patients`, // sem barra no final!
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data), // { name, cpf, birthdate }
    }),
  update: (id, data) =>
    $.ajax({
      url: `${BASE_URL}/patients/${encodeURIComponent(id)}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
    }),
  remove: (id) => $.ajax({ url: `${BASE_URL}/patients/${encodeURIComponent(id)}`, method: "DELETE" }),
};

// ===== Elementos da UI =====
const $tbody = $("#tbody-pacientes-list");
const $drawer = $("#drawer");
const $drawerNome = $("#drawer-nome");
const $drawerCPF = $("#drawer-cpf");
const $drawerNascimento = $("#drawer-nascimento");
const $drawerClose = $("#drawer-close");
const $btnAtualizar = $("#btnAtualizar");
const $btnExcluir = $("#btnExcluir");
const $btnNovo = $("#btnNovoPaciente");
const $search = $("#searchPacientes");

// ===== Estado =====
let pacientes = []; // [{ id, name, cpf, birthdate }]
let pacienteSelecionado = null;

// ===== Utilidades =====
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ajaxFail(label) {
  return (xhr) => {
    console.error(`${label} falhou`, {
      url: xhr?.responseURL,
      status: xhr?.status,
      response: xhr?.responseText,
    });
    alert(`${label} falhou (${xhr?.status || "?"}). Veja o console para detalhes.`);
  };
}

function isoToBr(isoLike) {
  // Converte "aaaa-mm-dd..." -> "dd/mm/aaaa"
  const s = String(isoLike || "").trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);  
  if (m) {
    const [, yyyy, mm, dd] = m;
    return `${dd}/${mm}/${yyyy}`;
  } 
  return s;
}

function brToIso(brLike) {
  // Converte "dd/mm/aaaa" -> "aaaa-mm-dd"
  console.log("brToIso", brLike);
  const s = String(brLike || "").trim();
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);  
  console.log("brToIso match", m);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  } 

  console.log("brToIso no match", s);
  return s;
}

// API<->UI mapping para render
function viewRow(p) {
  console.log("viewRow", p);
  return {
    id: p.id,
    nome: p.name,
    cpf: p.cpf,
    nascimentoBr: isoToBr(p.birthDate),
  };
}

// ===== Renderização =====
function renderTabela(lista) {
  $tbody.empty();
  if (!lista || lista.length === 0) {
    $tbody.append(
      `<tr><td colspan="3" style="text-align:center; color:var(--muted);">Nenhum paciente cadastrado</td></tr>`
    );
    return;
  }
  lista.forEach((p) => {
    const $tr = $(`
      <tr class="row-clickable">
        <td>${escapeHtml(p.nome)}</td>
        <td>${escapeHtml(p.cpf)}</td>
        <td>${escapeHtml(p.nascimentoBr)}</td>
      </tr>
    `);
    $tr.on("click", () => abrirDrawer(p));
    $tbody.append($tr);
  });
}

function carregarPacientes() {
  mostrarCarregando();
  API.list()
    .then((data) => {
      pacientes = (Array.isArray(data) ? data : []).map(viewRow);
      aplicarFiltroERender();
    })
    .catch((e) => {
      console.error(e);
      mostrarErro("Falha ao carregar pacientes.");
    });
}

function mostrarCarregando() {
  $tbody.html(`<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>`);
}
function mostrarErro(msg) {
  $tbody.html(
    `<tr><td colspan="3" style="text-align:center; color:#b00020;">${escapeHtml(msg)}</td></tr>`
  );
}

// ===== Drawer =====
function abrirDrawer(p) {
  pacienteSelecionado = p;
  $drawerNome.text(p.nome);
  $drawerCPF.text(p.cpf);
  $drawerNascimento.text(p.nascimentoBr);
  $drawer.addClass("open").removeAttr("hidden").attr("aria-hidden", "false");
}
function fecharDrawer() {
  $drawer.removeClass("open").attr("aria-hidden", "true");
  setTimeout(() => $drawer.attr("hidden", "true"), 250);
}
$drawerClose.on("click", fecharDrawer);

// ===== Busca (front-end) =====
$search.on("input", aplicarFiltroERender);
function aplicarFiltroERender() {
  const termo = ($search.val() || "").toString().trim().toLowerCase();
  if (!termo) return renderTabela(pacientes);
  const filtrados = pacientes.filter((p) => {
    return (
      (p.nome && p.nome.toLowerCase().includes(termo)) ||
      (p.cpf && p.cpf.toLowerCase().includes(termo)) ||
      (p.nascimentoBr && p.nascimentoBr.toLowerCase().includes(termo)) ||
      (String(p.id) === termo)
    );
  });
  renderTabela(filtrados);
}

// ===== Cadastrar =====
$btnNovo.on("click", () => {
  const nome = prompt("Nome do paciente:");
  if (!nome) return;
  const cpf = prompt("CPF:");
  if (!cpf) return;
  const nascimentoBr = prompt("Data de nascimento (dd/mm/aaaa):");
  if (!nascimentoBr) return;

  const payload = {
    name: nome,
    cpf: cpf,
    birthdate: brToIso(nascimentoBr),
  };

  API.create(payload)
    .then(() => carregarPacientes())
    .catch(ajaxFail("Criar paciente"));
});

// ===== Atualizar =====
$btnAtualizar.on("click", () => {
  if (!pacienteSelecionado) return;

  const novoNome = prompt("Atualizar nome:", pacienteSelecionado.nome);
  if (!novoNome) return;
  const novoCPF = prompt("Atualizar CPF:", pacienteSelecionado.cpf);
  if (!novoCPF) return;
  const novoNascimento = prompt(
    "Atualizar data de nascimento (dd/mm/aaaa):",
    pacienteSelecionado.nascimentoBr
  );
  if (!novoNascimento) return;

  const payload = {
    name: novoNome,
    cpf: novoCPF,
    birthDate: brToIso(novoNascimento),
  };

  console.log("Atualizar payload:", payload);
  API.update(pacienteSelecionado.id, payload)
    .then(() => {
      carregarPacientes();
      // reabrir com dados atualizados, se existir
      setTimeout(() => {
        const atualizado = pacientes.find((x) => x.id === pacienteSelecionado.id);
        if (atualizado) abrirDrawer(atualizado);
      }, 0);
    })
    .catch(ajaxFail("Atualizar paciente"));
});

// ===== Excluir =====
$btnExcluir.on("click", () => {
  if (!pacienteSelecionado) return;
  const ok = confirm(`Tem certeza que deseja excluir ${pacienteSelecionado.nome}?`);
  if (!ok) return;

  API.remove(pacienteSelecionado.id)
    .then(() => {
      fecharDrawer();
      carregarPacientes();
    })
    .catch(ajaxFail("Excluir paciente"));
});

// ===== Inicialização =====
$(function init() {
  carregarPacientes();
});
