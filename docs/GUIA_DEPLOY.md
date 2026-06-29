# Guía de deploy — Brainy

Pasos que tenés que hacer vos (necesitan tu cuenta de Google y GitHub).
Seguilos en orden. Cualquier cosa que falle, copiame el error.

---

## PARTE 1 — Backend (Google Sheets + Apps Script)

### 1. Crear la planilla
1. Andá a https://sheets.new (crea una Google Sheet nueva).
2. Ponele de nombre **Brainy** (arriba a la izquierda).
3. No hace falta crear pestañas ni columnas: el script las crea solo.

### 2. Pegar el código
1. En la planilla: menú **Extensiones → Apps Script**.
2. Se abre el editor. Borrá todo lo que diga en `Código.gs`.
3. Abrí el archivo `backend/Codigo.gs` de este proyecto, copiá TODO y pegalo ahí.
4. Apretá el ícono de guardar (💾) o `Ctrl+S`.

### 3. Correr el setup una vez
1. Arriba, en el selector de función, elegí **`setup`**.
2. Apretá **▶ Ejecutar**.
3. La primera vez te va a pedir permisos:
   - "Revisar permisos" → elegí tu cuenta de Google.
   - Va a aparecer "Google no verificó esta app" → **Configuración avanzada** →
     **Ir a Brainy (no seguro)** → **Permitir**. (Es tuya, está OK.)
4. Volvé a la planilla: deberían aparecer las pestañas **Tareas** y **Categorias**
   con las 3 categorías iniciales (Globant, Facu, Personal).

### 4. Publicar como Web App
1. En el editor de Apps Script: botón **Implementar → Nueva implementación**.
2. Ícono de engranaje ⚙ → tipo **Aplicación web**.
3. Configurá:
   - **Descripción:** Brainy API
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** **Cualquier persona**  ← IMPORTANTE
4. **Implementar** → **Autorizar acceso** si lo pide.
5. Copiá la **URL de la aplicación web** (termina en `/exec`).

### 5. Probar que anda
- Pegá esa URL en el navegador. Tenés que ver:
  `{"ok":true,"msg":"Brainy backend activo 🧠"}`

---

## PARTE 2 — Conectar el frontend

1. Abrí `src/index.html`.
2. Buscá la línea (cerca del `<script>`):
   ```js
   const API_URL = "";
   ```
3. Pegá tu URL entre las comillas:
   ```js
   const API_URL = "https://script.google.com/macros/s/AKfy.../exec";
   ```
4. Guardá. Abrí el archivo en el navegador: ahora las tareas se guardan en el Sheet.
   Probá agregar una y fijate que aparezca en la pestaña "Tareas" de la planilla.

> Si querés empezar de cero (sin las tareas de prueba), borrá las filas de la
> pestaña "Tareas" en el Sheet y, en el navegador, abrí la consola (F12) y corré:
> `localStorage.clear()` y recargá.

---

## PARTE 3 — Publicar la web (GitHub Pages)

1. Creá un repo nuevo en GitHub llamado **brainy** (público).
2. Subí el archivo `src/index.html` PERO renombralo a **`index.html`** en la raíz
   del repo (GitHub Pages busca `index.html` en la raíz).
3. En el repo: **Settings → Pages → Source: Deploy from a branch → main / root**.
4. Esperá 1-2 min. Te da una URL tipo `https://TUUSUARIO.github.io/brainy/`.

---

## PARTE 4 — Instalar en el iPhone/iPad

1. Abrí esa URL en **Safari** (no Chrome).
2. Botón **Compartir** (cuadradito con flecha) → **Agregar a inicio**.
3. Queda como app full screen, sin barra del navegador. 🧠

---

## Notas / problemas comunes

- **"Sin conexión — guardado local":** el frontend no pudo hablar con el Sheet.
  Revisá que la `API_URL` esté bien pegada y que el acceso sea "Cualquier persona".
- **Cambios en el código del backend:** cada vez que edites `Codigo.gs` tenés que
  hacer **Implementar → Gestionar implementaciones → editar (lápiz) → Nueva versión**.
  Si creás una implementación nueva, la URL cambia.
- Las fechas se guardan como texto a propósito (lección de Keo) para que Google no
  las reinterprete.
