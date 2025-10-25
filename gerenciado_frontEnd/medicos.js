// ===== Sistema de Médicos com Drawer + LocalStorage =====

// Chave para salvar no localStorage
const STORAGE_KEY = "lista_medicos";

// Carrega médicos salvos ou cria lista inicial
let medicos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: 1, nome: "Dr. João Silva", especialidade: "Cardiologia" },
  { id: 2, nome: "Dra. Ana Costa", especialidade: "Pediatria" },
];

const tbody = document.getElementById("tbody-medicos-list");
const drawer = document.getElementById("drawer");
const drawerNome = document.getElementById("drawer-nome");
const drawerEspecialidade = document.getElementById("drawer-especialidade");
const drawerClose = document.getElementById("drawer-close");
const btnAtualizar = document.getElementById("btnAtualizar");
const btnExcluir = document.getElementById("btnExcluir");
const btnNovo = document.getElementById("btnNovoMedico");

let medicoSelecionado = null;

// ===== Funções principais =====

// Salva no localStorage
function salvarNoLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medicos));
}

// Renderiza tabela de médicos
function renderMedicos() {
  tbody.innerHTML = "";
  if (medicos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:var(--muted);">Nenhum médico cadastrado</td></tr>`;
    return;
  }

  medicos.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.nome}</td><td>${m.especialidade}</td>`;
    tr.classList.add("row-clickable");
    tr.addEventListener("click", () => abrirDrawer(m));
    tbody.appendChild(tr);
  });
}

// Abre o drawer lateral
function abrirDrawer(medico) {
  medicoSelecionado = medico;
  drawerNome.textContent = medico.nome;
  drawerEspecialidade.textContent = medico.especialidade;
  drawer.classList.add("open");
  drawer.removeAttribute("hidden");
  drawer.setAttribute("aria-hidden", "false");
}

// Fecha o drawer
drawerClose.addEventListener("click", () => {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => drawer.setAttribute("hidden", "true"), 250);
});

// Atualizar médico
btnAtualizar.addEventListener("click", () => {
  if (!medicoSelecionado) return;
  const novoNome = prompt("Atualizar nome:", medicoSelecionado.nome);
  const novaEsp = prompt("Atualizar especialidade:", medicoSelecionado.especialidade);

  if (novoNome && novaEsp) {
    medicoSelecionado.nome = novoNome;
    medicoSelecionado.especialidade = novaEsp;
    salvarNoLocalStorage();
    renderMedicos();
    abrirDrawer(medicoSelecionado);
  }
});

// Excluir médico
btnExcluir.addEventListener("click", () => {
  if (!medicoSelecionado) return;
  if (confirm(`Tem certeza que deseja excluir ${medicoSelecionado.nome}?`)) {
    medicos = medicos.filter((m) => m.id !== medicoSelecionado.id);
    salvarNoLocalStorage();
    renderMedicos();
    drawerClose.click();
  }
});

// Cadastrar novo médico
btnNovo.addEventListener("click", () => {
  const nome = prompt("Nome do médico:");
  const especialidade = prompt("Especialidade:");

  if (nome && especialidade) {
    const novo = {
      id: Date.now(),
      nome,
      especialidade,
    };
    medicos.push(novo);
    salvarNoLocalStorage();
    renderMedicos();
  }
});

// Inicializa lista
renderMedicos();
