import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  crearColeccion,
  obtenerColecciones,
  obtenerLibrosColeccion,
  guardarLibro,
  quitarLibroColeccion,
} from '../../Servicios/BaseDatos';

import Libro from '../../Componenetes/Libros/Libro';

export default function VentanaLibreria({ onAbrirLibro }) {
  const [colecciones, setColecciones] = useState([]);
  const [seleccion, setSeleccion] = useState('favoritos');
  const [libros, setLibros] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const cargar = useCallback(async () => {
    try {
      const lista = await obtenerColecciones();
      setColecciones(lista);

      const items = await obtenerLibrosColeccion(seleccion);
      setLibros(items);

      const guardados = await obtenerLibrosColeccion('favoritos');
      setFavoritos(guardados);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar tu biblioteca.');
    }
  }, [seleccion]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async () => {
    if (!nuevoNombre.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre.');
      return;
    }

    try {
      const nueva = await crearColeccion(nuevoNombre);
      setNuevoNombre('');
      setSeleccion(nueva.id);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const actualizar = async () => {
    const lista = await obtenerColecciones();
    setColecciones(lista);
    setLibros(await obtenerLibrosColeccion(seleccion));
    setFavoritos(await obtenerLibrosColeccion('favoritos'));
  };

  const copiarAFavoritos = async (libro) => {
    try {
      await guardarLibro(libro, seleccion);
      await actualizar();

      Alert.alert(
        'Listo',
        'Libro agregado a tu colección.'
      );
    } catch {
      Alert.alert('Error', 'No se pudo agregar el libro.');
    }
  };

  const quitar = (libro) => {
    Alert.alert(
      'Quitar libro',
      `¿Quieres quitar "${libro.titulo}" de esta colección?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Quitar',
          style: 'destructive',
          onPress: async () => {
            try {
              await quitarLibroColeccion(libro.id, seleccion);
              await actualizar();
            } catch {
              Alert.alert('Error', 'No se pudo quitar el libro.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mi biblioteca</Text>

      <Text style={styles.subtitulo}>
        Guarda y organiza los libros que te gustan.
      </Text>

      <View style={styles.crearFila}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de nueva colección"
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
        />

        <Pressable style={styles.crearBoton} onPress={crear}>
          <Text style={styles.crearTexto}>Crear</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={colecciones}
        keyExtractor={(item) => item.id}
        style={styles.colecciones}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSeleccion(item.id)}
            style={[
              styles.chip,
              seleccion === item.id && styles.chipActivo,
            ]}
          >
            <Text
              style={[
                styles.chipTexto,
                seleccion === item.id && styles.chipTextoActivo,
              ]}
            >
              {item.nombre} ({item.cantidad})
            </Text>
          </Pressable>
        )}
      />

      <View style={styles.cabeceraLista}>
        <Text style={styles.seccion}>
          {colecciones.find((c) => c.id === seleccion)?.nombre || 'Colección'}
        </Text>

        <Text style={styles.contador}>
          {libros.length} libros
        </Text>
      </View>

      <FlatList
        data={libros}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Libro
            libro={item}
            onPress={() => onAbrirLibro?.(item)}
            etiquetaGuardar="Quitar"
            onGuardar={() => quitar(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Esta colección está vacía. Busca libros en Inicio o
            Explorar y guárdalos en Favoritos.
          </Text>
        }
      />

      {seleccion !== 'favoritos' && favoritos.length > 0 && (
        <View style={styles.seccionFavoritos}>
          <Text style={styles.seccionTitulo}>
            Añadir desde Favoritos
          </Text>

          <FlatList
            horizontal
            data={favoritos}
            keyExtractor={(item) => `fav-${item.id}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.favoritoChip}
                onPress={() => copiarAFavoritos(item)}
              >
                <Text
                  style={styles.favoritoTexto}
                  numberOfLines={1}
                >
                  ＋ {item.titulo}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F2',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#263A30',
  },
  subtitulo: {
    color: '#747B71',
    marginTop: 4,
    marginBottom: 16,
  },
  crearFila: {
    flexDirection: 'row',
    marginBottom: 13,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE2D9',
    borderRadius: 11,
    paddingHorizontal: 12,
    height: 44,
  },
  crearBoton: {
    backgroundColor: '#315C4C',
    borderRadius: 11,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
  },
  crearTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  colecciones: {
    maxHeight: 48,
    marginBottom: 15,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE2D9',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 8,
  },
  chipActivo: {
    backgroundColor: '#315C4C',
    borderColor: '#315C4C',
  },
  chipTexto: {
    color: '#526055',
    fontSize: 12,
  },
  chipTextoActivo: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cabeceraLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seccion: {
    fontSize: 17,
    fontWeight: '700',
    color: '#263A30',
  },
  contador: {
    color: '#85897F',
  },
  lista: {
    paddingBottom: 20,
  },
  seccionFavoritos: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  seccionTitulo: {
    color: '#35483C',
    fontWeight: '700',
    marginBottom: 8,
  },
  favoritoChip: {
    maxWidth: 190,
    backgroundColor: '#E6EFE8',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 8,
  },
  favoritoTexto: {
    color: '#315C4C',
    fontSize: 12,
  },
  vacio: {
    color: '#747B71',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 35,
    paddingHorizontal: 15,
  },
});