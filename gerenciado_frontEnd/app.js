// Dados de exemplo — substitua por dados reais ou carregue via API/fetch
const medicos = [
{  nome: 'Dra. Ana Ribeiro', especialidade: 'Pediatria' },
{  nome: 'Dr. Bruno Santos', especialidade: 'Cardiologia' },
{  nome: 'Dra. Carla Nunes', especialidade: 'Dermatologia' },
];


const pacientes = [
{ cpf: '123.456.789-00', nome: 'Marcos Lima', nascimento: '1989-07-18' },
{ cpf: '987.654.321-00', nome: 'Beatriz Souza', nascimento: '1995-02-05' },
{ cpf: '111.222.333-44', nome: 'José Almeida', nascimento: '1978-11-23' },
];


const consultas = [
{ id: 'C-101', paciente: 'Marcos Lima', medico: 'Dra. Ana Ribeiro', data: '2025-11-05 14:00', notas: 'Agendada' },
{ id: 'C-102', paciente: 'Beatriz Souza', medico: 'Dr. Bruno Santos', data: '2025-11-06 09:30', notas: 'Confirmada' },
{ id: 'C-103', paciente: 'José Almeida', medico: 'Dra. Carla Nunes', data: '2025-11-07 16:10',notas: 'Agendada' },
];

function renderMedicos(filter = '') {
const tbody = document.getElementById('tbody-medicos');
tbody.innerHTML = '';
medicos
.filter(m => m.nome.toLowerCase().includes(filter) || m.especialidade.toLowerCase().includes(filter))
.forEach(m => {
const tr = document.createElement('tr');
tr.innerHTML = `<td>${m.nome}</td><td>${m.especialidade}</td>`;
tbody.appendChild(tr);
});
}

function renderPacientes(filter = '') {
const tbody = document.getElementById('tbody-pacientes');
tbody.innerHTML = '';
pacientes
.filter(p => {
const f = filter.trim().toLowerCase();
const fNum = f.replace(/[^0-9]/g, '');
const cpfNum = p.cpf.replace(/[^0-9]/g, '');
return p.nome.toLowerCase().includes(f) ||
cpfNum.includes(fNum) ||
p.cpf.toLowerCase().includes(f) ||
p.nascimento.includes(f);
    })
.forEach(p => {
const tr = document.createElement('tr');
const nasc = new Date(p.nascimento).toLocaleDateString('pt-BR');
tr.innerHTML = `<td>${p.nome}</td><td>${nasc}</td><td>${p.cpf}</td>`;
tbody.appendChild(tr);
});
}





function renderConsultas(filter = '') {
const tbody = document.getElementById('tbody-consultas');
tbody.innerHTML = '';
consultas
.filter(c =>
c.id.toLowerCase().includes(filter) ||
c.paciente.toLowerCase().includes(filter) ||
c.medico.toLowerCase().includes(filter) ||
c.data.toLowerCase().includes(filter) ||
c.status.toLowerCase().includes(filter)
)
.forEach(c => {
const tr = document.createElement('tr');
const dataFmt = new Date(c.data.replace(' ', 'T')).toLocaleString('pt-BR');
tr.innerHTML = `<td>${c.id}</td><td>${c.paciente}</td><td>${c.medico}</td><td>${dataFmt}</td><td>${c.status}</td>`;
tbody.appendChild(tr);
});
}


function setActiveMenu(btn) {
document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
}


function wireup() {
// Render inicial
renderMedicos();
renderPacientes();
renderConsultas();


// Busca global
const search = document.getElementById('globalSearch');
search.addEventListener('input', (e) => {
const q = e.target.value.trim().toLowerCase();
renderMedicos(q);
renderPacientes(q);
renderConsultas(q);
});


// Navegação lateral (scroll até a seção)
document.querySelectorAll('.menu-item').forEach(btn => {
btn.addEventListener('click', () => {
setActiveMenu(btn);
const target = document.querySelector(btn.dataset.target);
target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
});
}


document.addEventListener('DOMContentLoaded', wireup);