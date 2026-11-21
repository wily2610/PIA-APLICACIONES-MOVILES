const API = 'https://openlibrary.org';

// Devuelve la dirección que utiliza el botón Leer de Inicio.
export function obtenerUrlLectura(libro) {
  if (libro?.archivoInternet) {
    return `https://archive.org/details/${encodeURIComponent(libro.archivoInternet)}`;
  }

  if (libro?.id?.startsWith('/works/')) {
    return `https://openlibrary.org${libro.id}`;
  }

  return null;
}

//busca libros en Open Library según la consulta y devuelve un arreglo de objetos con información relevante.
export async function buscarLibro(consulta, limite = 24) {
  const texto = String(consulta || '').trim();
  if (!texto) return [];

  const url = `${API}/search.json?q=${encodeURIComponent(texto)}&limit=${limite}&fields=key,title,author_name,first_publish_year,cover_i,subject,edition_count,ebook_access,ia`;

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Open Library respondió con error ${respuesta.status}.`);
  }

  const datos = await respuesta.json();
  const documentos = Array.isArray(datos.docs) ? datos.docs : [];

  return documentos.map((libro, indice) => ({
    id: libro.key || `openlibrary-${indice}`,
    titulo: libro.title || 'Título desconocido',

    autor: Array.isArray(libro.author_name)
      ? libro.author_name.join(', ')
      : 'Autor desconocido',

    anio: libro.first_publish_year || 'Año desconocido',

    portada: libro.cover_i
      ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
      : null,

    temas: Array.isArray(libro.subject)
      ? libro.subject.slice(0, 5)
      : [],

    ediciones: libro.edition_count || 0,
    acceso: libro.ebook_access || 'unknown',

    archivoInternet: Array.isArray(libro.ia)
      ? libro.ia[0]
      : null,

    origen: 'openlibrary',
  }));
}

export async function buscarPorCategoria(categoria, limite = 24) {
  return buscarLibro(`subject:${categoria}`, limite);
}