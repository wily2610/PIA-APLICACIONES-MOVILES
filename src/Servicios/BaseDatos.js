import * as SQLite from 'expo-sqlite';

let promesaBD;

async function obtenerBD() {
  if (!promesaBD) promesaBD = SQLite.openDatabaseAsync('biblioteca-virtual.db');
  return promesaBD;
}

export async function inicializarBaseDatos() {
  const db = await obtenerBD();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS colecciones (
      id TEXT PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      creada_en TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS libros_guardados (
      coleccion_id TEXT NOT NULL,
      libro_id TEXT NOT NULL,
      libro_json TEXT NOT NULL,
      guardado_en TEXT NOT NULL,
      PRIMARY KEY (coleccion_id, libro_id),
      FOREIGN KEY (coleccion_id) REFERENCES colecciones(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS historial (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      libro_id TEXT NOT NULL,
      libro_json TEXT NOT NULL,
      visto_en TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS libros_locales (
      id TEXT PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL,
      uri TEXT NOT NULL,
      mime_type TEXT,
      tamano INTEGER,
      agregado_en TEXT NOT NULL
    );
  `);
  await db.runAsync(
    'INSERT OR IGNORE INTO colecciones (id, nombre, creada_en) VALUES (?, ?, ?)',
    'favoritos', 'Favoritos', new Date().toISOString()
  );
}

export async function crearColeccion(nombre) {
  const limpio = String(nombre || '').trim();
  if (!limpio) throw new Error('Escribe un nombre para la colección.');
  const db = await obtenerBD();
  const id = `col-${Date.now()}`;
  await db.runAsync('INSERT INTO colecciones (id, nombre, creada_en) VALUES (?, ?, ?)', id, limpio, new Date().toISOString());
  return { id, nombre: limpio };
}

export async function obtenerColecciones() {
  const db = await obtenerBD();
  return db.getAllAsync(`
    SELECT c.id, c.nombre, c.creada_en, COUNT(l.libro_id) AS cantidad
    FROM colecciones c LEFT JOIN libros_guardados l ON l.coleccion_id = c.id
    GROUP BY c.id ORDER BY CASE WHEN c.id = 'favoritos' THEN 0 ELSE 1 END, c.nombre COLLATE NOCASE
  `);
}

export async function guardarLibro(libro, coleccionId = 'favoritos') {
  const db = await obtenerBD();
  const json = JSON.stringify(libro);
  await db.runAsync(
    'INSERT OR REPLACE INTO libros_guardados (coleccion_id, libro_id, libro_json, guardado_en) VALUES (?, ?, ?, ?)',
    coleccionId, String(libro.id), json, new Date().toISOString()
  );
}

export async function obtenerLibrosColeccion(coleccionId = 'favoritos') {
  const db = await obtenerBD();
  const filas = await db.getAllAsync('SELECT libro_json FROM libros_guardados WHERE coleccion_id = ? ORDER BY guardado_en DESC', coleccionId);
  return filas.map((fila) => JSON.parse(fila.libro_json));
}

export async function quitarLibroColeccion(libroId, coleccionId = 'favoritos') {
  const db = await obtenerBD();
  await db.runAsync('DELETE FROM libros_guardados WHERE coleccion_id = ? AND libro_id = ?', coleccionId, String(libroId));
}

export async function agregarHistorial(libro) {
  const db = await obtenerBD();
  await db.runAsync('INSERT INTO historial (libro_id, libro_json, visto_en) VALUES (?, ?, ?)', String(libro.id), JSON.stringify(libro), new Date().toISOString());
}

export async function obtenerHistorial() {
  const db = await obtenerBD();
  const filas = await db.getAllAsync('SELECT id, libro_json, visto_en FROM historial ORDER BY id DESC LIMIT 100');
  return filas.map((fila) => ({ ...JSON.parse(fila.libro_json), historialId: fila.id, vistoEn: fila.visto_en }));
}

export async function limpiarHistorial() {
  const db = await obtenerBD();
  await db.runAsync('DELETE FROM historial');
}

export async function agregarLibroLocal(archivo) {
  const db = await obtenerBD();
  const id = `local-${Date.now()}`;
  await db.runAsync(
    'INSERT INTO libros_locales (id, titulo, uri, mime_type, tamano, agregado_en) VALUES (?, ?, ?, ?, ?, ?)',
    id, archivo.name || 'Libro sin título', archivo.uri, archivo.mimeType || null,
    archivo.size || null, new Date().toISOString()
  );
  return id;
}

export async function obtenerLibrosLocales() {
  const db = await obtenerBD();
  return db.getAllAsync('SELECT * FROM libros_locales ORDER BY agregado_en DESC');
}

export async function quitarLibroLocal(id) {
  const db = await obtenerBD();
  await db.runAsync('DELETE FROM libros_locales WHERE id = ?', id);
}
