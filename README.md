# Biblioteca Virtual (Expo + JavaScript)

## Requisitos
- Node.js LTS
- Expo Go compatible con Expo SDK 58

## Instalación
1. Descomprime esta carpeta.
2. Abre la carpeta BibliotecaLibros en VS Code.
3. Ejecuta `npm install`.
4. Ejecuta `npx expo install` para alinear los módulos con el SDK del proyecto.
5. Ejecuta `npx expo start -c`.

## Funciones incluidas
- Inicio: catálogo consultado desde Open Library.
- Explorar: búsqueda y filtros por categoría.
- Biblioteca: colección Favoritos y creación de colecciones propias.
- Agregar: importar PDF, EPUB y TXT desde Android mediante expo-document-picker.
- Historial: registro local de libros consultados.
- Persistencia local con expo-sqlite.
- Navegación inferior construida con componentes nativos de React Native, sin React Navigation.

## Notas importantes
- Open Library proporciona metadatos y portadas; no garantiza que todos los libros tengan texto completo gratuito.
- Los archivos locales se seleccionan con el selector del sistema y se registran en SQLite. PDF/EPUB se abren con una aplicación compatible instalada en Android. La URI copiada a caché puede dejar de estar disponible si Android limpia la caché; para una versión de producción conviene copiar los archivos al directorio persistente con expo-file-system.
- La app no incluye cuentas ni sincronización en la nube. Los datos quedan en el dispositivo.
- Si una categoría no devuelve resultados, prueba otra categoría o busca por título/autor.
