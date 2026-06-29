/**
 * Brainy — Backend (Google Apps Script)
 * ------------------------------------------------------------
 * Web App que usa una Google Sheet como base de datos.
 * Maneja tareas y categorías. Todo entra/sale como JSON por POST.
 *
 * Pestañas que usa (las crea solas si no existen):
 *   - "Tareas":     id | titulo | categoria | fecha | completada | fechaCompletada | ts
 *   - "Categorias": nombre | color
 *
 * Lección heredada de Keo: las columnas de fecha se guardan como TEXTO
 * (setNumberFormat('@')) para que Google no reinterprete las fechas.
 * ------------------------------------------------------------
 */

var SHEET_TAREAS = "Tareas";
var SHEET_CATS   = "Categorias";
var HEAD_TAREAS  = ["id","titulo","categoria","fecha","completada","fechaCompletada","ts"];
var HEAD_CATS    = ["nombre","color"];
var CATS_INICIALES = [
  ["Globant",  "#8A9A7B"],
  ["Facu",     "#B79B7E"],
  ["Personal", "#9CA9B5"]
];

/** Punto de entrada único. El frontend manda {action, ...datos} como JSON. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var req = JSON.parse(e.postData.contents);
    var action = req.action;
    var out;
    switch (action) {
      case "bootstrap":        out = { tareas: leerTareas(), categorias: leerCats() }; break;
      case "agregarTarea":     out = agregarTarea(req); break;
      case "editarTarea":      out = editarTarea(req); break;
      case "setCompletada":    out = setCompletada(req.id, req.completada); break;
      case "borrarTarea":      out = borrarTarea(req.id); break;
      case "agregarCategoria": out = agregarCategoria(req.nombre, req.color); break;
      case "editarCategoria":  out = editarCategoria(req.nombreViejo, req.nombreNuevo, req.color); break;
      case "borrarCategoria":  out = borrarCategoria(req.nombre); break;
      default: out = { error: "Acción desconocida: " + action };
    }
    return json({ ok: true, data: out });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permite probar que el deploy anda abriendo la URL en el navegador. */
function doGet() {
  return json({ ok: true, msg: "Brainy backend activo 🧠" });
}

/* ============================================================
   TAREAS
   ============================================================ */
function leerTareas() {
  var sh = hojaTareas();
  var vals = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var r = vals[i];
    if (!r[0]) continue;
    out.push({
      id: String(r[0]), titulo: r[1], categoria: r[2], fecha: r[3] ? String(r[3]) : "",
      completada: r[4] === true || r[4] === "TRUE" || r[4] === "true",
      fechaCompletada: r[5] ? String(r[5]) : "", ts: Number(r[6]) || 0
    });
  }
  return out;
}

function agregarTarea(req) {
  var sh = hojaTareas();
  var fila = [
    req.id, req.titulo, req.categoria, req.fecha || "",
    false, "", req.ts || Date.now()
  ];
  sh.appendRow(fila);
  // forzar formato texto en columnas de fecha (D y F) de la fila recién agregada
  var row = sh.getLastRow();
  sh.getRange(row, 4).setNumberFormat("@").setValue(req.fecha || "");
  sh.getRange(row, 6).setNumberFormat("@").setValue("");
  return { id: req.id };
}

function editarTarea(req) {
  var sh = hojaTareas();
  var row = filaPorId(sh, req.id);
  if (row < 0) return { error: "No existe" };
  sh.getRange(row, 2).setValue(req.titulo);
  sh.getRange(row, 3).setValue(req.categoria);
  sh.getRange(row, 4).setNumberFormat("@").setValue(req.fecha || "");
  return { id: req.id };
}

function setCompletada(id, completada) {
  var sh = hojaTareas();
  var row = filaPorId(sh, id);
  if (row < 0) return { error: "No existe" };
  sh.getRange(row, 5).setValue(completada);
  var fc = completada ? hoyISO() : "";
  sh.getRange(row, 6).setNumberFormat("@").setValue(fc);
  return { id: id, completada: completada };
}

function borrarTarea(id) {
  var sh = hojaTareas();
  var row = filaPorId(sh, id);
  if (row < 0) return { error: "No existe" };
  sh.deleteRow(row);
  return { id: id };
}

/* ============================================================
   CATEGORÍAS
   ============================================================ */
function leerCats() {
  var sh = hojaCats();
  var vals = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    out.push({ nombre: vals[i][0], color: vals[i][1] });
  }
  return out;
}

function agregarCategoria(nombre, color) {
  var sh = hojaCats();
  sh.appendRow([nombre, color]);
  return { nombre: nombre, color: color };
}

function editarCategoria(viejo, nuevo, color) {
  var sh = hojaCats();
  var vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][0] === viejo) {
      sh.getRange(i + 1, 1).setValue(nuevo);
      sh.getRange(i + 1, 2).setValue(color);
      break;
    }
  }
  // re-etiquetar tareas de esa categoría
  if (viejo !== nuevo) {
    var sht = hojaTareas();
    var tv = sht.getDataRange().getValues();
    for (var j = 1; j < tv.length; j++) {
      if (tv[j][2] === viejo) sht.getRange(j + 1, 3).setValue(nuevo);
    }
  }
  return { nombre: nuevo, color: color };
}

function borrarCategoria(nombre) {
  var sh = hojaCats();
  var vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][0] === nombre) { sh.deleteRow(i + 1); break; }
  }
  return { nombre: nombre };
}

/* ============================================================
   HELPERS
   ============================================================ */
function hojaTareas() { return getOrCreate(SHEET_TAREAS, HEAD_TAREAS); }
function hojaCats() {
  var sh = getOrCreate(SHEET_CATS, HEAD_CATS);
  if (sh.getLastRow() < 2) { // sembrar categorías iniciales una sola vez
    CATS_INICIALES.forEach(function (c) { sh.appendRow(c); });
  }
  return sh;
}

function getOrCreate(nombre, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function filaPorId(sh, id) {
  var vals = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
  for (var i = 1; i < vals.length; i++) if (String(vals[i][0]) === String(id)) return i + 1;
  return -1;
}

function hoyISO() {
  var d = new Date();
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Corré esta función UNA VEZ desde el editor (botón ▶) para crear las
 * pestañas y sembrar las categorías iniciales antes del primer uso.
 */
function setup() {
  hojaTareas();
  hojaCats();
  SpreadsheetApp.getActiveSpreadsheet().toast("Brainy listo ✓", "Setup", 5);
}
