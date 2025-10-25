const STORAGE_KEY = "lista_consultas";
let consultas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const tbody = document.getElementById("tbody-consultas-list");
const drawer = document.getElementById("drawer");
const drawerPaciente = document.getElementById("drawer-paciente");
const drawerDoutor = document.getElementById("drawer-doutor");
const drawerData = document.getElementById("drawer-data");
const drawerHora = document.getElementById("drawer-hora");
const drawerClose = document.getElementById("drawer-close");
const btnAtualizar = document.getElementById("btnAtualizar");
const btnExcluir = document.getElementById("btnExcluir");
const btnNova = document.getElementById("btnNovaConsulta");

let consultaSelecionada = null;

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
}

function renderConsultas() {
  tbody.innerHTML = "";
  if (consultas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--muted);">Nenhuma consulta cadastrada</td></tr>`;
    return;
  }

  consultas.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${c.paciente}</td><td>${c.doutor}</td><td>${c.data}</td><td>${c.hora}</td>`;
    tr.classList.add("row-clickable");
    tr.addEventListener("click", () => abrirDrawer(c));
    tbody.appendChild(tr);
  });
}

function abrirDrawer(c) {
  consultaSelecionada = c;
  drawerPaciente.textContent = c.paciente;
  drawerDoutor.textContent = c.doutor;
  drawerData.textContent = c.data;
  drawerHora.textContent = c.hora;
  drawer.classList.add("open");
  drawer.hidden = false;
}

drawerClose.onclick = () => {
  drawer.classList.remove("open");
  setTimeout(() => (drawer.hidden = true), 250);
};

btnNova.onclick = () => {
  const paciente = prompt("Nome do paciente:");
  const doutor = prompt("Nome do doutor:");
  const data = prompt("Data da consulta (dd/mm/aaaa):");
  const hora = prompt("Hora da consulta (hh:mm):");

  if (paciente && doutor && data && hora) {
    consultas.push({ id: Date.now(), paciente, doutor, data, hora });
    salvar();
    renderConsultas();
  }
};

btnAtualizar.onclick = () => {
  if (!consultaSelecionada) return;
  const novoPaciente = prompt("Atualizar paciente:", consultaSelecionada.paciente);
  const novoDoutor = prompt("Atualizar doutor:", consultaSelecionada.doutor);
  const novaData = prompt("Atualizar data:", consultaSelecionada.data);
  const novaHora = prompt("Atualizar hora:", consultaSelecionada.hora);

  if (novoPaciente && novoDoutor && novaData && novaHora) {
    consultaSelecionada.paciente = novoPaciente;
    consultaSelecionada.doutor = novoDoutor;
    consultaSelecionada.data = novaData;
    consultaSelecionada.hora = novaHora;
    salvar();
    renderConsultas();
    abrirDrawer(consultaSelecionada);
  }
};

btnExcluir.onclick = () => {
  if (confirm(`Excluir consulta de ${consultaSelecionada.paciente}?`)) {
    consultas = consultas.filter((c) => c.id !== consultaSelecionada.id);
    salvar();
    renderConsultas();
    drawerClose.click();
  }
};

renderConsultas();
