// consultas.js — integração com backend usando jQuery (sem optional chaining)
const API_APPTS = "http://localhost:8080/api/appointments";
const API_PATIENTS = "http://localhost:8080/api/patients";
const API_DOCTORS = "http://localhost:8080/api/doctors";

// ====== Elementos do DOM ======
var $tbody = $("#tbody-consultas-list");
var $drawer = $("#drawer");
var $drawerPaciente = $("#drawer-paciente");
var $drawerDoutor = $("#drawer-doutor");
var $drawerData = $("#drawer-data");
var $drawerHora = $("#drawer-hora");
var $drawerClose = $("#drawer-close");
var $btnAtualizar = $("#btnAtualizar");
var $btnExcluir = $("#btnExcluir");
var $btnNova = $("#btnNovaConsulta");
var $search = $("#searchConsultas");

// Modal / form
var $modal = $("#nova-consulta-modal");
var $modalClose = $("#modal-close");
var $modalCancel = $("#modal-cancel");
var $modalSave = $("#modal-save");
var $selectPaciente = $("#selectPaciente");
var $selectMedico = $("#selectMedico");
var $inputDateTime = $("#inputDateTime");
var $inputNotes = $("#inputNotes");

// Estado
var cacheConsultas = [];
var consultaSelecionada = null;
var pacientesCache = [];
var medicosCache = [];
// ====== Data/Hora (pt-BR) ======
// Parse "YYYY-MM-DDTHH:mm[:ss]" (sem timezone) como horário LOCAL de forma segura (compatível com Safari)
function parseIsoLocal(isoLocal) {
  if (!isoLocal || typeof isoLocal !== "string") return null;
  var parts = isoLocal.split("T");
  if (parts.length !== 2) return null;
  var d = parts[0].split("-");
  var t = parts[1].split(":");
  if (d.length < 3 || t.length < 2) return null;
  var year = parseInt(d[0], 10);
  var month = parseInt(d[1], 10) - 1; // 0-11
  var day = parseInt(d[2], 10);
  var hour = parseInt(t[0], 10);
  var minute = parseInt(t[1], 10);
  var second = 0;
  if (t.length >= 3) {
    // remove sufixo .sss se existir
    var secStr = t[2].split(".")[0];
    second = parseInt(secStr, 10) || 0;
  }
  var dt = new Date(year, month, day, hour, minute, second);
  if (isNaN(dt.getTime())) return null;
  return dt;
}

function formatDateBR(dt) {
  try {
    return dt.toLocaleDateString("pt-BR"); // dd/mm/aaaa
  } catch(e) {
    var dd = String(dt.getDate()).padStart(2,"0");
    var mm = String(dt.getMonth()+1).padStart(2,"0");
    var yyyy = String(dt.getFullYear());
    return dd + "/" + mm + "/" + yyyy;
  }
}

function formatTimeBR(dt) {
  try {
    return dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); // HH:mm
  } catch(e) {
    var HH = String(dt.getHours()).padStart(2,"0");
    var MM = String(dt.getMinutes()).padStart(2,"0");
    return HH + ":" + MM;
  }
}

function toBRDateTimeLocalString(isoLocal) {
  var dt = parseIsoLocal(isoLocal);
  if (!dt) return { data: "-", hora: "-" };
  return { data: formatDateBR(dt), hora: formatTimeBR(dt) };
}

// Lazy ensure modal refs (in case HTML loads after initial bind)
function ensureModalRefs() {
  if (!$modal || $modal.length === 0) { $modal = $("#nova-consulta-modal"); }
  if (!$modalClose || $modalClose.length === 0) { $modalClose = $("#modal-close"); $modalClose.off("click").on("click", closeModal); }
  if (!$modalCancel || $modalCancel.length === 0) { $modalCancel = $("#modal-cancel"); $modalCancel.off("click").on("click", closeModal); }
  if (!$modalSave || $modalSave.length === 0) { $modalSave = $("#modal-save"); $modalSave.off("click").on("click", onModalSave); }
  if (!$selectPaciente || $selectPaciente.length === 0) { $selectPaciente = $("#selectPaciente"); }
  if (!$selectMedico || $selectMedico.length === 0) { $selectMedico = $("#selectMedico"); }
  if (!$inputDateTime || $inputDateTime.length === 0) { $inputDateTime = $("#inputDateTime"); }
  if (!$inputNotes || $inputNotes.length === 0) { $inputNotes = $("#inputNotes"); }
}

function onModalSave(){
  var patientId = $selectPaciente.val();
  var doctorId = $selectMedico.val();
  var dtLocal = $inputDateTime.val();
  var notes = ($inputNotes.val() || "").toString();

  if (!patientId) { alert("Selecione um paciente."); return; }
  if (!doctorId) { alert("Selecione um médico."); return; }
  if (!dtLocal)   { alert("Informe a data e hora."); return; }

  var dateTime = ensureIsoWithZ(dtLocal);
  if (!dateTime) { alert("Data e hora inválidas."); return; }

  var payload = {
    patient: { id: Number(patientId) },
    doctor:  { id: Number(doctorId) },
    dateTime: dateTime,
    notes: notes
  };

  apiCriar(payload).then(function(){
    closeModal();
    alert("Consulta criada com sucesso!");
    recarregarLista();
  }).fail(function(err){
    console.error(err);
    alert("Erro ao criar a consulta.");
  });
}


// ====== Helpers ======

function ensureIsoWithZ(localValue) {
  // espera 'YYYY-MM-DDTHH:mm' de <input type="datetime-local">
  if (!localValue) return null;
  var dt = new Date(localValue);
  if (isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

function openModal() {
  ensureModalRefs();
  // usa jQuery para evitar conflito com CSS
  console.log("Abrindo modal...");
  $modal.css("display", "flex").show();
  
}

function closeModal() {
  $modal.hide();
  $selectPaciente.val("");
  $selectMedico.val("");
  $inputDateTime.val("");
  $inputNotes.val("");
}

function renderConsultas(lista) {
  $tbody.empty();
  if (!lista || lista.length === 0) {
    $tbody.append('<tr><td colspan="4" style="text-align:center; opacity:.7;">Nenhuma consulta cadastrada</td></tr>');
    return;
  }
  lista.forEach(function(c) {
    var patientName = (c && c.patient && c.patient.name) ? c.patient.name : "-";
    var doctorName  = (c && c.doctor && c.doctor.name) ? c.doctor.name : "-";
    var cNotes  = (c && c.notes ) ? c.notes : "-";
    var dth = toBRDateTimeLocalString(c.dateTime);
    var $tr = $('<tr class="row-clickable">\
      <td>'+patientName+'</td>\
      <td>'+doctorName+'</td>\
      <td>'+dth.data+'</td>\
      <td>'+dth.hora+'</td>\
      <td>'+cNotes+'</td>\
    </tr>');
    $tr.on("click", function(){ abrirDrawer(c); });
    $tbody.append($tr);
  });
}

function abrirDrawer(c) {
  consultaSelecionada = c;
  var dth = toBRDateTimeLocalString(c.dateTime);
  $drawerPaciente.text((c && c.patient && c.patient.name) ? c.patient.name : "-");
  $drawerDoutor.text((c && c.doctor && c.doctor.name) ? c.doctor.name : "-");
  $drawerData.text(dth.data);
  $drawerHora.text(dth.hora);
  $drawer.prop("hidden", false).addClass("open");
}

function fecharDrawer() {
  $drawer.removeClass("open");
  setTimeout(function(){ $drawer.prop("hidden", true); }, 250);
}

// ====== API ======
function apiListarTodas() {
  return $.ajax({ url: API_APPTS, method: "GET", dataType: "json" });
}
function apiBuscarPorId(id) {
  return $.ajax({ url: API_APPTS + "/" + encodeURIComponent(id), method: "GET", dataType: "json" });
}
function apiCriar(payload) {
  return $.ajax({ url: API_APPTS, method: "POST", contentType: "application/json", data: JSON.stringify(payload), dataType: "json" });
}
function apiAtualizar(id, payload) {
  return $.ajax({ url: API_APPTS + "/" + encodeURIComponent(id), method: "PUT", contentType: "application/json", data: JSON.stringify(payload), dataType: "json" });
}
function apiExcluir(id) {
  return $.ajax({ url: API_APPTS + "/" + encodeURIComponent(id), method: "DELETE" });
}
function apiListarPacientes() {
  return $.ajax({ url: API_PATIENTS, method: "GET", dataType: "json" });
}
function apiListarMedicos() {
  return $.ajax({ url: API_DOCTORS, method: "GET", dataType: "json" });
}

// ====== Combos ======
function carregarCombosSeNecessario() {
  return $.when(
    (!Array.isArray(pacientesCache) || pacientesCache.length === 0) ? apiListarPacientes().then(function(p){ pacientesCache = p; }) : $.Deferred().resolve(),
    (!Array.isArray(medicosCache) || medicosCache.length === 0) ? apiListarMedicos().then(function(m){ medicosCache = m; }) : $.Deferred().resolve()
  ).then(function(){
    // pacientes
    $selectPaciente.empty().append('<option value="" disabled selected>Selecione o paciente</option>');
    (pacientesCache || []).forEach(function(p){
      var id = (p && p.id != null) ? p.id : "";
      var nome = (p && (p.name || p.fullName)) ? (p.name || p.fullName) : ("Paciente " + id);
      $selectPaciente.append('<option value="'+id+'">'+nome+'</option>');
    });
    // medicos
    $selectMedico.empty().append('<option value="" disabled selected>Selecione o médico</option>');
    (medicosCache || []).forEach(function(d){
      var id = (d && d.id != null) ? d.id : "";
      var nome = (d && (d.name || d.fullName)) ? (d.name || d.fullName) : ("Médico " + id);
      $selectMedico.append('<option value="'+id+'">'+nome+'</option>');
    });
  }).fail(function(err){
    console.error("Erro ao carregar combos:", err);
    alert("Erro ao carregar pacientes/médicos para o cadastro.");
  });
}

// ====== Eventos ======
$drawerClose.on("click", fecharDrawer);

$btnNova.on("click", function(){
  ensureModalRefs();
  carregarCombosSeNecessario().then(function(){
    openModal();
  });
});

ensureModalRefs();
$modalClose.on("click", closeModal);
$modalCancel.on("click", closeModal);

$modalSave.on("click", onModalSave);/*rebound*/
function __noop__(){
  var patientId = $selectPaciente.val();
  var doctorId = $selectMedico.val();
  var dtLocal = $inputDateTime.val();
  var notes = ($inputNotes.val() || "").toString();

  if (!patientId) { alert("Selecione um paciente."); return; }
  if (!doctorId) { alert("Selecione um médico."); return; }
  if (!dtLocal)   { alert("Informe a data e hora."); return; }

  var dateTime = ensureIsoWithZ(dtLocal);
  if (!dateTime) { alert("Data e hora inválidas."); return; }

  var payload = {
    patient: { id: Number(patientId) },
    doctor:  { id: Number(doctorId) },
    dateTime: dateTime,
    notes: notes
  };

  apiCriar(payload).then(function(){
    closeModal();
    alert("Consulta criada com sucesso!");
    recarregarLista();
  }).fail(function(err){
    console.error(err);
    alert("Erro ao criar a consulta.");
  });
}

$btnAtualizar.on("click", function(){
  if (!consultaSelecionada) return;
  var atual = consultaSelecionada;

  var defaultDtLocal = (atual && typeof atual.dateTime === "string") ? atual.dateTime.slice(0,16) : "";  
  var dtLocal   = prompt("Data/hora (YYYY-MM-DDTHH:mm):", defaultDtLocal) || defaultDtLocal;
  var notes     = prompt("Observações:", (atual && atual.notes) ? atual.notes : "") || ((atual && atual.notes) ? atual.notes : "");

  var dateTime = ensureIsoWithZ(dtLocal);
  if (!dateTime) { alert("Data e hora inválidas."); return; }

  var payload = {
    id: atual.id,    
    dateTime: dateTime,
    notes: notes
  };

  apiAtualizar(atual.id, payload).then(function(){
    alert("Consulta atualizada com sucesso!");
    recarregarLista();
  }).fail(function(err){
    console.error(err);
    alert("Erro ao atualizar a consulta.");
  });
});

$btnExcluir.on("click", function(){
  if (!consultaSelecionada) return;
  var name = (consultaSelecionada && consultaSelecionada.patient && consultaSelecionada.patient.name) ? consultaSelecionada.patient.name : "paciente";
  if (!confirm("Excluir consulta #"+consultaSelecionada.id+" de "+name+"?")) return;
  apiExcluir(consultaSelecionada.id).then(function(){
    alert("Consulta excluída.");
    fecharDrawer();
    recarregarLista();
  }).fail(function(err){
    console.error(err);
    alert("Erro ao excluir a consulta.");
  });
});

$search.on("keydown", function(e){
  if (e.key !== "Enter") return;
  var q = ($search.val() || "").toString().trim();
  if (!q) { renderConsultas(cacheConsultas); return; }
  if (/^\d+$/.test(q)) {
    apiBuscarPorId(q).then(function(item){
      renderConsultas(item ? [item] : []);
    }).fail(function(){
      alert("Consulta não encontrada.");
      renderConsultas([]);
    });
  } else {
    var lower = q.toLowerCase();
    var filtrado = cacheConsultas.filter(function(c){
      var p = (c && c.patient && c.patient.name) ? c.patient.name.toLowerCase() : "";
      var d = (c && c.doctor && c.doctor.name) ? c.doctor.name.toLowerCase() : "";
      var s = (c && c.doctor && c.doctor.speciality) ? c.doctor.speciality.toLowerCase() : "";
      var n = (c && c.notes) ? c.notes.toLowerCase() : "";
      return p.indexOf(lower) >= 0 || d.indexOf(lower) >= 0 || s.indexOf(lower) >= 0 || n.indexOf(lower) >= 0;
    });
    renderConsultas(filtrado);
  }
});

var searchTimer = null;
$search.on("input", function(){
  clearTimeout(searchTimer);
  var q = ($search.val() || "").toString().trim().toLowerCase();
  searchTimer = setTimeout(function(){
    if (!q) { renderConsultas(cacheConsultas); return; }
    var filtrado = cacheConsultas.filter(function(c){
      var p = (c && c.patient && c.patient.name) ? c.patient.name.toLowerCase() : "";
      var d = (c && c.doctor && c.doctor.name) ? c.doctor.name.toLowerCase() : "";
      var s = (c && c.doctor && c.doctor.speciality) ? c.doctor.speciality.toLowerCase() : "";
      var n = (c && c.notes) ? c.notes.toLowerCase() : "";
      return p.indexOf(q) >= 0 || d.indexOf(q) >= 0 || s.indexOf(q) >= 0 || n.indexOf(q) >= 0;
    });
    renderConsultas(filtrado);
  }, 180);
});

// ====== Fluxo inicial ======
function recarregarLista() {
  apiListarTodas().then(function(lista){
    cacheConsultas = Array.isArray(lista) ? lista : [];
    renderConsultas(cacheConsultas);
  }).fail(function(err){
    console.error(err);
    alert("Erro ao carregar as consultas.");
    renderConsultas([]);
  });
}

$(function init(){
  recarregarLista();
});
