# Contexto del proyecto Brainy

## Origen de la idea

Luca quería una web útil para usar desde su iPhone/iPad. Surgió como una agenda
de tareas personal: anotar cosas simples del día a día y sacarse el peso de la
cabeza. De ahí el nombre **Brainy** (concepto de "segundo cerebro").

## Para qué sirve

Gestionar tareas cortas y eventos con cuenta regresiva. Casos de uso típicos:
- "parcial", "final", "hacer tal cosa", "ir a tal lado antes de tal"
- Eventos con countdown: parciales/finales, fechas importantes → "faltan X días"

## Decisiones de producto (entrevista con Luca)

1. **Fechas de vencimiento opcionales.** Una tarea puede ser solo "para hoy" o
   tener fecha futura. Si tiene fecha, muestra un countdown de días.
2. **Countdown integrado, no separado.** El evento es una tarea con fecha; el
   countdown aparece dentro de la misma tarjeta. La fecha es opcional.
3. **Organización por categorías + vista global.** Se ve por categoría y también
   una vista "Todas".
4. **Categorías editables.** Se pueden crear, editar y borrar. Arranca con:
   `Globant`, `Facu`, `Personal`.
5. **Carga rápida, poco texto.** Títulos cortos. El flujo es abrir → agregar 1 o
   varias tareas → cerrar. Tiene que ser ágil, no para escribir textos largos.
6. **Completadas se ocultan.** Al completar una tarea desaparece de la vista
   principal y va a una sección de "Completadas" más oculta (pero accesible).
   Nada se borra: queda guardado.

## Diseño

- Minimalista y estético.
- Paleta de **colores naturales/orgánicos** (tierra): beige, verde salvia,
  marrón claro, blanco roto.
- Debe transmitir **tranquilidad y comodidad**.
- Mobile-first, optimizado para iPhone/iPad (home screen, full screen, touch
  targets grandes).
- Sin dark/light mode por ahora — paleta fija cálida.

## Restricciones técnicas

- Mismo stack que el proyecto Keo (Luca ya lo domina): HTML/JS standalone +
  Apps Script + Sheets + GitHub Pages.
- Lección aprendida de Keo: aplicar formato texto a las celdas de fecha en el
  Sheet (`setNumberFormat('@')` + `setValue()`) para evitar que Google
  reinterprete las fechas.
