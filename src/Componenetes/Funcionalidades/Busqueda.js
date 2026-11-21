import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
} from 'react-native';

import {
  buscarLibro,
  buscarPorCategoria,
  obtenerUrlLectura,
} from '../../Servicios/AppLibroAPI';

import {
  agregarHistorial,
  guardarLibro,
} from '../../Servicios/BaseDatos';

import Libro from '../Libros/Libro';
import BotonFiltro from './BotonFiltro';

const CATEGORIAS = [
  { nombre: 'Ficción', valor: 'fiction' },
  { nombre: 'Fantasía', valor: 'fantasy' },
  { nombre: 'Ciencia ficción', valor: 'science_fiction' },
  { nombre: 'Historia', valor: 'history' },
  { nombre: 'Ciencia', valor: 'science' },
  { nombre: 'Filosofía', valor: 'philosophy' },
  { nombre: 'Misterio', valor: 'mystery' },
  { nombre: 'Romance', valor: 'romance' },
  { nombre: 'Biografía', valor: 'biography' },
  { nombre: 'Tecnología', valor: 'technology' },
];

export default function Busqueda({
  explorar = false,
  inicial = 'subject:fiction',
  onAbrirLibro,
}) {
  const [texto, setTexto] = useState('');
  const [libros, setLibros] = useState([]);
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const ejecutarBusqueda = async (valor, porCategoria = false) => {
    try {
      setCargando(true);
      setError('');

      const resultado = porCategoria
        ? await buscarPorCategoria(valor)
        : await buscarLibro(valor);

      setLibros(resultado);

      if (!resultado.length) {
        setError('No encontramos libros. Prueba con otro título o autor.');
      }
    } catch (e) {
      setError(e.message || 'No se pudo conectar con Open Library.');
      setLibros([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    ejecutarBusqueda(inicial);
  }, []);

  const seleccionarCategoria = (item) => {
    setCategoria(item);
    setTexto('');
    ejecutarBusqueda(item.valor, true);
  };

  // Abrir detalles del libro.
  const abrirDetalle = async (libro) => {
    try {
      await agregarHistorial(libro);

      if (onAbrirLibro) {
        onAbrirLibro(libro);
      } else {
        Alert.alert(
          libro.titulo,
          `${libro.autor}\n${libro.anio}`
        );
      }
    } catch {
      Alert.alert(
        'Error',
        'No se pudo registrar el historial.'
      );
    }
  };

  // Abrir directamente la lectura.
  const leerLibro = async (libro) => {
    try {
      await agregarHistorial(libro);

      const url = obtenerUrlLectura(libro);

      if (!url) {
        Alert.alert(
          'Lectura no disponible',
          'Este registro no tiene una dirección de lectura disponible.'
        );
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'No disponible',
        'No se pudo abrir la página de lectura del libro.'
      );
    }
  };

  // Guardar en Favoritos.
  const guardar = async (libro) => {
    try {
      await guardarLibro(libro);

      Alert.alert(
        'Guardado',
        'Se agregó a tu colección Favoritos.'
      );
    } catch {
      Alert.alert(
        'Error',
        'No se pudo guardar el libro.'
      );
    }
  };

  const enviar = () => {
    const q = texto.trim();

    if (!q) {
      setError('Escribe un título o autor para buscar.');
      return;
    }

    ejecutarBusqueda(q);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.encabezado}>
        {explorar
          ? 'Explora el catálogo'
          : 'Descubre tu próxima lectura'}
      </Text>

      <Text style={styles.subtitulo}>
        Busca libros por título o autor
      </Text>

      <View style={styles.filaBusqueda}>
        <TextInput
          style={styles.input}
          placeholder="Buscar libros..."
          placeholderTextColor="#8A9087"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
          returnKeyType="search"
        />

        <Pressable
          style={styles.botonBuscar}
          onPress={enviar}
        >
          <Text style={styles.botonBuscarTexto}>
            Buscar
          </Text>
        </Pressable>
      </View>

      {explorar && (
        <>
          <Text style={styles.etiqueta}>
            Categorías
          </Text>

          <View style={styles.categorias}>
            {CATEGORIAS.map((item) => (
              <BotonFiltro
                key={item.valor}
                titulo={item.nombre}
                activo={
                  categoria.valor === item.valor && !texto
                }
                onPress={() => seleccionarCategoria(item)}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.tituloLista}>
        <Text style={styles.tituloSeccion}>
          {explorar ? 'Resultados' : 'Libros disponibles'}
        </Text>

        <Text style={styles.contador}>
          {libros.length} libros
        </Text>
      </View>

      {cargando && (
        <ActivityIndicator
          size="large"
          color="#315C4C"
          style={{ marginTop: 30 }}
        />
      )}

      {!!error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <FlatList
        data={libros}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Libro
            libro={item}
            onPress={() => abrirDetalle(item)}
            onLeer={() => leerLibro(item)}
            onGuardar={() => guardar(item)}
          />
        )}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !cargando && !error ? (
            <Text style={styles.vacio}>
              Los libros aparecerán aquí.
            </Text>
          ) : null
        }
      />

      <Text style={styles.nota}>
        Catálogo y portadas proporcionados por Open Library.
        No todos los libros tienen lectura gratuita disponible.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F7F7F2',
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  encabezado: {
    fontSize: 23,
    fontWeight: '800',
    color: '#263A30',
  },

  subtitulo: {
    color: '#747B71',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },

  filaBusqueda: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE2D9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    color: '#263A30',
  },

  botonBuscar: {
    backgroundColor: '#315C4C',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginLeft: 8,
  },

  botonBuscarTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  etiqueta: {
    fontWeight: '700',
    color: '#35483C',
    marginBottom: 8,
  },

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 7,
  },

  tituloLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },

  tituloSeccion: {
    color: '#263A30',
    fontSize: 17,
    fontWeight: '700',
  },

  contador: {
    color: '#85897F',
    fontSize: 12,
  },

  lista: {
    paddingBottom: 16,
  },

  error: {
    color: '#B42318',
    backgroundColor: '#FEE4E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  vacio: {
    color: '#747B71',
    textAlign: 'center',
    marginTop: 25,
  },

  nota: {
    color: '#8A9087',
    fontSize: 10,
    paddingVertical: 7,
  },
});