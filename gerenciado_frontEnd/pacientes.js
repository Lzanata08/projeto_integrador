
const STORAGE_KEY = "lista_pacientes";
let pacientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const tbody = document.getElementById("tbody-pacientes-list");
const drawer = document.getElementById("drawer");
const drawerNome = document.getElementById("drawer-nome");
const drawerCPF = document.getElementById("drawer-cpf");
const drawerNascimento = document.getElementById("drawer-nascimento");
const drawerClose = document.getElementById("drawer-close");
const btnAtualizar = document.getElementById("btnAtualizar");
const btnExcluir = document.getElementById("btnExcluir");
const btnNovo = document.getElementById("btnNovoPaciente");

let pacienteSelecionado = null;

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes));
}

function renderPacientes() {
  tbody.innerHTML = "";
  if (pacientes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--muted);">Nenhum paciente cadastrado</td></tr>`;
    return;
  }

  pacientes.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.nome}</td><td>${p.cpf}</td><td>${p.nascimento}</td>`;
    tr.classList.add("row-clickable");
    tr.addEventListener("click", () => abrirDrawer(p));
    tbody.appendChild(tr);
  });
}

function abrirDrawer(p) {
  pacienteSelecionado = p;
  drawerNome.textContent = p.nome;
  drawerCPF.textContent = p.cpf;
  drawerNascimento.textContent = p.nascimento;
  drawer.classList.add("open");
  drawer.hidden = false;
}

drawerClose.onclick = () => {
  drawer.classList.remove("open");
  setTimeout(() => (drawer.hidden = true), 250);
};

btnNovo.onclick = () => {
  const nome = prompt("Nome do paciente:");
  const cpf = prompt("CPF:");
  const nascimento = prompt("Data de nascimento (dd/mm/aaaa):");

  if (nome && cpf && nascimento) {
    pacientes.push({ id: Date.now(), nome, cpf, nascimento });
    salvar();
    renderPacientes();
  }
};

btnAtualizar.onclick = () => {
  if (!pacienteSelecionado) return;
  const novoNome = prompt("Atualizar nome:", pacienteSelecionado.nome);
  const novoCPF = prompt("Atualizar CPF:", pacienteSelecionado.cpf);
  const novoNascimento = prompt("Atualizar data de nascimento:", pacienteSelecionado.nascimento);

  if (novoNome && novoCPF && novoNascimento) {
    pacienteSelecionado.nome = novoNome;
    pacienteSelecionado.cpf = novoCPF;
    pacienteSelecionado.nascimento = novoNascimento;
    salvar();
    renderPacientes();
    abrirDrawer(pacienteSelecionado);
  }
};

btnExcluir.onclick = () => {
  if (confirm(`Excluir ${pacienteSelecionado.nome}?`)) {
    pacientes = pacientes.filter((p) => p.id !== pacienteSelecionado.id);
    salvar();
    renderPacientes();
    drawerClose.click();
  }
};

renderPacientes();
