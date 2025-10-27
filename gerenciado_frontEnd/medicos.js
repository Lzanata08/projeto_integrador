const BASE_URL = "http://localhost:8080/api";
const API = {
  list: () => $.ajax({ url: `${BASE_URL}/doctors`, method: "GET" }),
  get: (id) => $.ajax({ url: `${BASE_URL}/doctors/${encodeURIComponent(id)}`, method: "GET" }),
  create: (data) =>
    $.ajax({
      url: `${BASE_URL}/doctors`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
    }),
  update: (id, data) =>
    $.ajax({
      url: `${BASE_URL}/doctors/${encodeURIComponent(id)}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
    }),
  remove: (id) => $.ajax({ url: `${BASE_URL}/doctors/${encodeURIComponent(id)}`, method: "DELETE" }),
};

// Elementos da UI
const $tbody = $("#tbody-medicos-list");
const $drawer = $("#drawer");
const $drawerNome = $("#drawer-nome");
const $drawerEspecialidade = $("#drawer-especialidade");
const $drawerClose = $("#drawer-close");
const $btnAtualizar = $("#btnAtualizar");
const $btnExcluir = $("#btnExcluir");
const $btnNovo = $("#btnNovoMedico");
const $search = $("#searchMedicos");

// Estado em memória
let medicos = []; // [{id, name, speciality}]
let medicoSelecionado = null;

// ==== Helpers de mapeamento (API -> UI e UI -> API) ====
function apiToUi(doc) {
  // API: {id, name, speciality} -> UI: {id, nome, especialidade}
  return { id: doc.id, nome: doc.name, especialidade: doc.speciality };
}
function uiToApi(ui) {
  // UI: {id, nome, especialidade} -> API: {id, name, speciality}
  const base = { name: ui.nome, speciality: ui.especialidade };
  if (ui.id != null) base.id = ui.id;
  return base;
}

// ==== Renderização ====
function renderTabela(lista) {
  $tbody.empty();
  if (!lista || lista.length === 0) {
    $tbody.append(
      `<tr><td colspan="2" style="text-align:center; color:var(--muted);">Nenhum médico cadastrado</td></tr>`
    );
    return;
  }

  lista.forEach((m) => {
    const $tr = $(`
      <tr class="row-clickable">
        <td>${escapeHtml(m.nome)}</td>
        <td>${escapeHtml(m.especialidade)}</td>
      </tr>
    `);
    $tr.on("click", () => abrirDrawer(m));
    $tbody.append($tr);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ==== Drawer ====
function abrirDrawer(m) {
  medicoSelecionado = m;
  $drawerNome.text(m.nome);
  $drawerEspecialidade.text(m.especialidade);
  $drawer.addClass("open").removeAttr("hidden").attr("aria-hidden", "false");
}

function fecharDrawer() {
  $drawer.removeClass("open").attr("aria-hidden", "true");
  // espera a animação (se houver)
  setTimeout(() => $drawer.attr("hidden", "true"), 250);
}

$drawerClose.on("click", fecharDrawer);

// ==== Ações CRUD ====
async function carregarMedicos() {
  mostrarCarregando();
  try {
    const lista = await API.list();
    // Garante array e mapeia para formato de UI
    medicos = (Array.isArray(lista) ? lista : []).map(apiToUi);
    aplicarFiltroERender();
  } catch (err) {
    mostrarErro("Falha ao carregar médicos.");
    console.error(err);
  }
}

function mostrarCarregando() {
  $tbody.html(
    `<tr><td colspan="2" style="text-align:center;">Carregando...</td></tr>`
  );
}

function mostrarErro(msg) {
  $tbody.html(
    `<tr><td colspan="2" style="text-align:center; color:#b00020;">${escapeHtml(
      msg
    )}</td></tr>`
  );
}

// Cadastrar
$btnNovo.on("click", async () => {
  const nome = prompt("Nome do médico:");
  if (!nome) return;
  const especialidade = prompt("Especialidade:");
  if (!especialidade) return;

  try {
    console.log(uiToApi({ nome, especialidade }));
    await API.create(uiToApi({ nome, especialidade }));
    console.log("Médico cadastrado com sucesso.");
    await carregarMedicos();
  } catch (err) {
    alert("Não foi possível cadastrar o médico.");
    console.error(err);
  }
});

// Atualizar
$btnAtualizar.on("click", async () => {
  if (!medicoSelecionado) return;
  const novoNome = prompt("Atualizar nome:", medicoSelecionado.nome);
  if (!novoNome) return;
  const novaEsp = prompt(
    "Atualizar especialidade:",
    medicoSelecionado.especialidade
  );
  if (!novaEsp) return;

  try {
    await API.update(medicoSelecionado.id, uiToApi({ nome: novoNome, especialidade: novaEsp }));
    await carregarMedicos();
    // Reabrir drawer com dados atualizados
    const atualizado = medicos.find((m) => m.id === medicoSelecionado.id);
    if (atualizado) abrirDrawer(atualizado);
  } catch (err) {
    alert("Não foi possível atualizar o médico.");
    console.error(err);
  }
});

// Excluir
$btnExcluir.on("click", async () => {
  if (!medicoSelecionado) return;
  const ok = confirm(`Tem certeza que deseja excluir ${medicoSelecionado.nome}?`);
  if (!ok) return;

  try {
    await API.remove(medicoSelecionado.id);
    fecharDrawer();
    await carregarMedicos();
  } catch (err) {
    alert("Não foi possível excluir o médico.");
    console.error(err);
  }
});

// ==== Busca (filtro no front por nome/especialidade) ====
$search.on("input", aplicarFiltroERender);

function aplicarFiltroERender() {
  const termo = ($search.val() || "").toString().trim().toLowerCase();
  if (!termo) {
    renderTabela(medicos);
    return;
  }
  const filtrados = medicos.filter((m) => {
    return (
      (m.nome && m.nome.toLowerCase().includes(termo)) ||
      (m.especialidade && m.especialidade.toLowerCase().includes(termo)) ||
      (String(m.id) === termo) // permite filtrar por id exato
    );
  });
  renderTabela(filtrados);
}

// ==== Inicialização ====
$(async function init() {
  await carregarMedicos();
});
