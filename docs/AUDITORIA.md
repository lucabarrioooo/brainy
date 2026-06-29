# Auditoría y roadmap — Brainy

Fecha: 2026-06-28. Revisión del frontend (`src/index.html`) y backend (`backend/Codigo.gs`).

---

## 🔴 Bugs / riesgos (arreglar)

### 1. Cambios offline que nunca suben (cola de sync)
Si `api()` falla (sin señal), el cambio queda solo en localStorage y **no se
reintenta nunca**. El toast dice "guardado local" pero no vuelve a subir al recuperar
conexión → se pierde la sincronización con el Sheet.
**Fix:** outbox (cola de operaciones pendientes) que reintenta al volver online.

### 2. Privacidad: la URL del backend está expuesta
El Web App está como "Cualquier persona" y la `API_URL` está hardcodeada en el
`index.html` que se publica en GitHub Pages → **cualquiera que mire el código fuente
puede leer/editar tus tareas**. No hay datos sensibles, pero es tu agenda.
**Fix opciones:** (a) token compartido simple en cada request; (b) asumir el riesgo
(datos no críticos); (c) ofuscar mínimamente. Recomendado: token simple.

### 3. Timezone del backend
`hoyISO()` usa `Session.getScriptTimeZone()`. Si el proyecto de Apps Script no está
en `America/Argentina/Buenos_Aires`, la `fechaCompletada` puede descuadrar un día.
**Fix:** fijar la zona horaria en el manifiesto del Apps Script.

### 4. Categorías borradas dejan tareas completadas huérfanas
`delCat()` solo chequea tareas **activas**. Si borrás una categoría con tareas ya
completadas, esas quedan con una categoría inexistente (badge gris).
**Fix:** chequear también completadas, o reasignar a "Sin categoría".

### 5. `prompt()` para renombrar categoría
Feo y, en modo standalone de iOS (app en home screen), puede comportarse raro.
**Fix:** modal propio en el estilo de la app.

### 6. Sin estado de carga inicial
En un dispositivo nuevo (sin cache), al abrir hay un parpadeo de "vacío" hasta que
llega el `bootstrap()`. **Fix:** skeleton / spinner sutil.

---

## 🟡 Mejoras de UX (alto impacto, bajo costo)

- **Deshacer al borrar/completar:** toast con botón "Deshacer" en vez de confirm.
- **Ícono propio (apple-touch-icon):** hoy al agregar a home screen el ícono es un
  screenshot, no el cerebrito. Generar PNG del logo.
- **Buscar / filtrar** tareas (útil cuando se acumulan).
- **Prioridad** (alta/normal) con indicador visual y orden.
- **Festejo de la mascota** al completar todo (salto + carita feliz).
- **Accesibilidad:** `aria-label` en botones de ícono, `aria-hidden` en la mascota.

## 🟢 Funcionalidades nuevas (producto)

- **Vista "Próximos eventos":** pantalla dedicada al countdown (parciales/finales)
  que Luca pidió como concepto central, con los días grandes.
- **Subtareas / checklist** dentro de una tarea.
- **Nota / descripción** opcional por tarea.
- **Tareas recurrentes** (ej: "todos los lunes").
- **Recordatorios por mail:** Apps Script con trigger diario que manda un resumen
  de lo que vence hoy (no necesita push nativo).
- **Estadísticas:** cuántas completás por semana, racha.
- **Archivar automático** de completadas viejas (>30 días).

## 🔧 Técnico / robustez

- **PWA real:** `manifest.json` + service worker → funciona offline de verdad,
  ícono propio, splash screen. Es el salto más grande hacia "se siente app nativa".
- **Backend:** `filaPorId` y escrituras celda-a-celda son O(n) y lentas en Apps
  Script (~1-2s/req). Para uso personal está bien; si crece, batch updates.
- **Versionado:** mover el proyecto a Git real (hoy solo backups manuales en
  `versiones/`).

---

## Prioridad sugerida (qué haría primero)

1. **Cola de sync (bug #1)** — es el único que puede hacerte perder datos.
2. **PWA + ícono propio** — el mayor salto de sensación "app nativa" en el iPhone.
3. **Deshacer al borrar** — evita borrados accidentales sin diálogos molestos.
4. **Token de privacidad (#2)** — rápido y te protege la agenda.
5. **Vista de Próximos eventos** — conecta con la idea original del countdown.

El resto (recurrentes, subtareas, stats) son features lindas pero secundarias.
