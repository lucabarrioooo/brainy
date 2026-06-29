# Especificación funcional — Brainy

## Modelo de datos

### Pestaña `Tareas` (Google Sheet)
| Columna          | Tipo    | Descripción                                  |
|------------------|---------|----------------------------------------------|
| id               | texto   | identificador único (timestamp o uuid)       |
| titulo           | texto   | título corto de la tarea                     |
| categoria        | texto   | nombre de la categoría                       |
| fechaVencimiento | texto   | fecha opcional (formato texto, puede estar vacía) |
| completada       | bool    | TRUE / FALSE                                 |
| fechaCompletada  | texto   | cuándo se marcó como completada              |
| timestamp        | texto   | cuándo se creó                               |

### Pestaña `Categorias` (Google Sheet)
| Columna | Tipo  | Descripción                       |
|---------|-------|-----------------------------------|
| nombre  | texto | nombre de la categoría            |
| color   | texto | color asociado (hex de la paleta) |

Categorías iniciales: `Globant`, `Facu`, `Personal`.

## Endpoints (Apps Script Web App)

| Acción              | Parámetros                                  | Devuelve            |
|---------------------|---------------------------------------------|---------------------|
| `getTareas`         | —                                           | tareas activas      |
| `getCompletadas`    | —                                           | tareas completadas  |
| `getCategorias`     | —                                           | lista de categorías |
| `agregarTarea`      | titulo, categoria, fechaVencimiento?        | tarea creada        |
| `completarTarea`    | id                                          | ok                  |
| `reactivarTarea`    | id                                          | ok                  |
| `borrarTarea`       | id                                          | ok                  |
| `agregarCategoria`  | nombre, color                               | ok                  |
| `editarCategoria`   | nombreViejo, nombreNuevo, color             | ok                  |
| `borrarCategoria`   | nombre                                      | ok                  |

## Pantallas / Vistas

1. **Vista principal**
   - Tabs de vista: `Todas` + una por cada categoría.
   - Lista de tareas activas, cada una con:
     - título
     - badge de categoría (con su color)
     - countdown si tiene fecha: `Hoy`, `Mañana`, `En X días`, `Vencida hace X días`
     - acción para completar (tap/checkbox)
   - Botón flotante `+` para agregar tarea.

2. **Agregar tarea** (bottom sheet estilo iOS)
   - input de título
   - selector de categoría
   - fecha opcional (date picker)

3. **Completadas** (sección oculta, accesible por ícono)
   - lista de tareas completadas
   - posibilidad de reactivar o borrar

4. **Gestión de categorías**
   - crear / editar nombre y color / borrar

## Lógica de countdown

A partir de `fechaVencimiento` vs hoy:
- diferencia = 0 → `Hoy`
- diferencia = 1 → `Mañana`
- diferencia > 1 → `En N días`
- diferencia < 0 → `Vencida hace N días` (destacada visualmente)

## Comportamiento

- Al completar → desaparece de la vista principal, pasa a Completadas.
- Nada se borra automáticamente. Solo el usuario borra manualmente.
- Orden de la lista: por fecha de vencimiento ascendente; las sin fecha al final.
