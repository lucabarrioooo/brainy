# Avances — Brainy

Registro cronológico del estado del proyecto.

---

## 2026-06-29 — Finales, horario y fix Dynamic Island (v5) — pusheado

Backup anterior en `versiones/index_v4_sync.html`.
- ✅ **Fix Dynamic Island / línea blanca:** `apple-mobile-web-app-status-bar-style`
  = black-translucent + `mobile-web-app-capable` + `html { background }` para que
  el fondo llegue al borde y se integre con el notch/isla.
- ✅ **Horario opcional:** input `time` en alta/edición. Se guarda DENTRO del campo
  `fecha` como `YYYY-MM-DDTHH:MM` (NO requiere tocar el backend). Helpers
  `fechaParte()` / `horaParte()`; countdown y orden usan solo la parte fecha.
- ✅ **Sección Finales:** categoría especial "Finales" (persistida vía campo
  categoria, sin tocar backend; `ensureFinales()` la crea si falta). Cuadro
  destacado en la vista "Todas" con countdown de días en grande, ordenado de la
  más próxima a la más lejana. Toggle (switch) "En la lista" que decide si los
  finales se mezclan también en la lista de Todas (persistido en
  `brainy_fin_todas`, default true).
- ✅ JS validado con `node --check`. Pusheado a main → online.
- Nota: "Finales" también aparece como tab/categoría normal (vista filtrada).

---

## 2026-06-28 — DEPLOY a GitHub Pages ✅

- ✅ Repo creado: https://github.com/lucabarrioooo/brainy (público).
- ✅ `index.html` copiado a la raíz del repo (Pages sirve desde main / root).
- ✅ GitHub Pages activado y verificado ONLINE.
- 🌐 **URL en vivo: https://lucabarrioooo.github.io/brainy/**
- Cuenta GitHub: lucabarrioooo. Git configurado global (lucabarrio11@gmail.com).
- Decisión: repo PÚBLICO (Pages gratis lo requiere); la API_URL queda visible.
  Aceptado por Luca (tareas personales, no sensibles). Token = mejora futura.
- ⬜ PENDIENTE: instalar en el iPhone (Safari → Compartir → Agregar a inicio).
- ⬜ Para actualizar la web a futuro: editar, copiar src→raíz, commit y push.

---

## 2026-06-28 — Mejoras frontend post-auditoría (v4)

Backup anterior en `versiones/index_v3_mascota.html`. Todo sin que Luca toque
backend/deploy (cambios solo en `src/index.html`):
- ✅ **Cola de sync (outbox)** con reintento: cada mutación se encola en
  localStorage y se sube; si falla (offline) queda pendiente y se reintenta al
  volver la conexión (evento `online`). Indicador `#syncDot` en el header.
  `api()` ya no es fire-and-forget; las mutaciones usan `queue()`/`flush()`.
- ✅ **Deshacer** al borrar y al completar (toast con botón "Deshacer", 4.5s).
- ✅ **Festejo de la mascota** + toast 🎉 al completar todas las tareas.
- ✅ **Fix categorías huérfanas:** `delCat` ahora cuenta también completadas.
- ✅ **Modal propio** para editar categoría (nombre + color); chau `prompt()`.
- ✅ **Skeleton shimmer** mientras carga el primer bootstrap (flag `loaded`).
- ✅ **Accesibilidad:** aria-labels en botones, aria-hidden en mascota/íconos.
- ⬜ PENDIENTE (requiere acción de Luca): token de privacidad y timezone
  (redeploy del Apps Script), y PWA + ícono propio (GitHub Pages). Ver AUDITORIA.md.

---

## 2026-06-28 — Mascota + animaciones (v3)

Backup anterior en `versiones/index_v2_backend.html`.
- ✅ Mascota "Brainy": cerebrito SVG con bracitos y patitas, hecha a mano (función
  `mascot()`). Animaciones idle: flotar (body float), saludar (arm-wave) y
  parpadear (eyes blink). Aparece en el header (chica) y en los estados vacíos (grande).
- ✅ Animaciones generales más orgánicas: entrada escalonada de tarjetas (stagger
  por nth-child), check que se dibuja (stroke-dashoffset), entrada del header/
  progreso/tabs/FAB, easing tipo spring en botones y chips, glow en inputs al focus,
  barrita de acento que crece al apretar la tarjeta.
- ✅ Respeta `prefers-reduced-motion` (accesibilidad).
- ✅ Paleta de la mascota integrada (arcilla/terracota cálida) sin romper la estética.
- ⬜ Pendiente: feedback de Luca sobre v3.

---

## 2026-06-28 — Edición de tareas + deploy en curso

- ✅ Backend deployado por Luca; Sheet "Brainy" andando, ciclo completo probado OK.
- ✅ `API_URL` pegada en `src/index.html` (deploy `/exec` de Luca).
- ✅ Agregada EDICIÓN de tareas (faltaba): tocar el cuerpo de una tarea activa
  abre el panel prellenado; backend nueva acción `editarTarea` (titulo/categoria/
  fecha por id). Panel reutilizado en modo add/edit con `editingId`.
- ⬜ Luca debe re-pegar `Codigo.gs` actualizado en Apps Script y crear NUEVA
  VERSIÓN de la implementación existente (sin cambiar la URL).
- ⬜ Pendiente: GitHub Pages + instalar en iPhone.

---

## 2026-06-28 — Backend (Fase 1 + integración)

- ✅ `backend/Codigo.gs` escrito: Web App de Apps Script con doPost (canal JSON
  único) + doGet (test). Acciones: bootstrap, agregarTarea, setCompletada,
  borrarTarea, agregarCategoria, editarCategoria, borrarCategoria.
- ✅ Crea pestañas Tareas/Categorias solo, siembra categorías iniciales, función
  `setup()` para correr una vez. LockService para concurrencia. Fechas como texto
  (`setNumberFormat('@')`, lección de Keo).
- ✅ Frontend integrado con UI optimista + cache localStorage: cada acción
  actualiza local y empuja al Sheet en segundo plano; `bootstrap()` al abrir
  refresca desde la nube. Constante `API_URL` (si vacía → modo local, no rompe).
- ✅ Manejo de error: si falla la red, toast "Sin conexión — guardado local".
- ✅ `docs/GUIA_DEPLOY.md` con el paso a paso para Luca (Sheet, Apps Script,
  pegar URL, GitHub Pages, instalar en iPhone).
- ⬜ PENDIENTE (lo hace Luca): crear Sheet, deployar Apps Script, pegar API_URL,
  subir a GitHub Pages, instalar en el iPhone.

---

## 2026-06-28 — Mejoras de diseño (v2)

Luca lo vio "basicón". Backup del anterior en `versiones/index_v1_mock.html`.
Aplicado sobre `src/index.html`:
- Tipografía editorial serif (ui-serif/New York/Fraunces) en título, headings y labels destacados.
- Saludo dinámico según la hora ("Buen día, Luca").
- Tarjeta de progreso del día con anillo SVG animado (% completado) + resumen.
- Accent bar de color de categoría en el borde izquierdo de cada tarjeta.
- Íconos SVG line-style (feather) reemplazando emojis en botones y acciones.
- Animación de salida (slide+fade) al completar una tarea.
- Agrupación temporal en vista "Todas": Hoy / Próximas / Sin fecha.
- Fondo con degradés radiales suaves + textura de grano SVG.
- Atajos rápidos de fecha en el alta (Hoy / Mañana / En 1 semana / Sin fecha).
- ⬜ Pendiente: feedback de Luca sobre v2.

---

## 2026-06-28 — Frontend mock (Fase 2)

- ✅ `src/index.html` creado: app completa con datos mock en `localStorage`.
- ✅ Implementado: vista por categorías + "Todas", lista con countdown
  (Hoy/Mañana/En X días/Vencida), botón flotante "+", bottom sheet para agregar
  (título + categoría + fecha opcional), sección "Completadas" oculta,
  gestión de categorías (crear/editar/borrar con color), toast.
- ✅ Diseño: paleta tierra (beige, salvia, arcilla), mobile-first, meta tags iOS
  para home screen y full screen.
- ✅ Capa de datos aislada en objeto `DB` → al conectar backend solo se reemplaza
  ese objeto por fetch al Apps Script (misma API interna).
- ⬜ Pendiente: ronda de ajustes/feedback de Luca sobre el frontend.
- ⬜ Backend Apps Script + Sheet + deploy.
- ⬜ Repo GitHub `brainy` + Pages + prueba en dispositivo.

---

## 2026-06-28 — Arranque

- ✅ Entrevista de requisitos con Luca completada.
- ✅ Decisiones de producto documentadas en `CONTEXTO.md`.
- ✅ Especificación funcional escrita en `ESPECIFICACION.md`.
- ✅ Estructura de carpetas del proyecto creada.
- ⬜ Frontend (`src/index.html`) — pendiente.
- ⬜ Backend Apps Script (`backend/Codigo.gs`) — pendiente.
- ⬜ Crear Google Sheet "Brainy" — pendiente.
- ⬜ Deploy Apps Script Web App — pendiente.
- ⬜ Crear repo GitHub `brainy` + GitHub Pages — pendiente.
- ⬜ Probar en iPhone/iPad y agregar a home screen — pendiente.

### Plan de construcción acordado
1. **Fase 1 — Backend:** Sheet + Apps Script + deploy.
2. **Fase 2 — Frontend:** diseño + vistas + agregar/completar + categorías.
3. **Fase 3 — Integración:** conectar fetch, estados de carga, optimización iOS.
4. **Fase 4 — Deploy:** repo GitHub + Pages + prueba en dispositivo.

**Orden de trabajo elegido:** arrancar por frontend con datos de prueba (mock)
para ver la app andando rápido, luego conectar backend real.

---

<!-- Próximas entradas van arriba de esta línea, con fecha. -->
