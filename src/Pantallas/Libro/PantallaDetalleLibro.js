import React from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';

import { agregarHistorial } from '../../Servicios/BaseDatos';
import { obtenerUrlLectura } from '../../Servicios/AppLibroAPI';

export default function PantallaDetalleLibro({
  libro,
  onVolver,
  mostrarBotonLeer = false,
}) {
  const abrirLectura = async () => {
    try {
      const url = obtenerUrlLectura(libro);

      if (!url) {
        Alert.alert(
          'Lectura no disponible',
          'Este libro no tiene una dirección de lectura registrada.'
        );
        return;
      }

      await agregarHistorial(libro);
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Error',
        'No fue posible abrir la lectura del libro.'
      );
    }
  };

  const acceso = {
    public: 'Disponible para lectura pública',
    borrowable: 'Disponible mediante préstamo',
    readable: 'Disponible para lectura en línea',
    restricted: 'Acceso restringido',
    no_ebook: 'Sin versión digital disponible',
    printdisabled: 'Acceso limitado',
    unknown: 'Disponibilidad no confirmada',
  };

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <Pressable
          onPress={onVolver}
          style={styles.botonVolver}
        >
          <Text style={styles.textoVolver}>
            ‹ {mostrarBotonLeer ? 'Mi biblioteca' : 'Regresar'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.contenido}>
        {libro.portada ? (
          <Image
            source={{ uri: libro.portada }}
            style={styles.portada}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.portada, styles.sinPortada]}>
            <Text style={styles.sinPortadaTexto}>
              Sin portada
            </Text>
          </View>
        )}

        <Text style={styles.titulo}>
          {libro.titulo || 'Título desconocido'}
        </Text>

        <Text style={styles.autor}>
          {libro.autor || 'Autor desconocido'}
        </Text>

        <View style={styles.separador} />

        <Text style={styles.encabezado}>
          Información del libro
        </Text>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>
            Año de publicación
          </Text>

          <Text style={styles.valor}>
            {libro.anio || 'Desconocido'}
          </Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>
            Ediciones
          </Text>

          <Text style={styles.valor}>
            {libro.ediciones || 'No especificadas'}
          </Text>
        </View>

        <View style={styles.fila}>
          <Text style={styles.etiqueta}>
            Disponibilidad
          </Text>

          <Text style={styles.valor}>
            {acceso[libro.acceso] || acceso.unknown}
          </Text>
        </View>

        {!!libro.temas?.length && (
          <View style={styles.temas}>
            <Text style={styles.encabezado}>
              Temas
            </Text>

            <View style={styles.etiquetas}>
              {libro.temas.map((tema, indice) => (
                <View
                  key={`${tema}-${indice}`}
                  style={styles.tema}
                >
                  <Text style={styles.temaTexto}>
                    {tema}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {mostrarBotonLeer && (
          <>
            <Pressable
              style={styles.botonLeer}
              onPress={abrirLectura}
            >
              <Text style={styles.botonLeerTexto}>
                Leer libro ↗
              </Text>
            </Pressable>

            <Text style={styles.nota}>
              La lectura o el préstamo dependen de los derechos
              y la disponibilidad del libro en Internet Archive
              / Open Library.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F2',
  },

  barra: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8E0',
  },

  botonVolver: {
    alignSelf: 'flex-start',
  },

  textoVolver: {
    color: '#315C4C',
    fontSize: 16,
    fontWeight: '700',
  },

  contenido: {
    alignItems: 'center',
    padding: 22,
    paddingBottom: 40,
  },

  portada: {
    width: 185,
    height: 260,
    borderRadius: 12,
    backgroundColor: '#E8E8DF',
    marginBottom: 22,
  },

  sinPortada: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  sinPortadaTexto: {
    color: '#747B71',
  },

  titulo: {
    color: '#263A30',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },

  autor: {
    color: '#747B71',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },

  separador: {
    height: 1,
    backgroundColor: '#DDE2D9',
    width: '100%',
    marginVertical: 22,
  },

  encabezado: {
    alignSelf: 'flex-start',
    color: '#263A30',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 13,
  },

  fila: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8E0',
  },

  etiqueta: {
    color: '#747B71',
    flex: 1,
  },

  valor: {
    color: '#263A30',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  temas: {
    width: '100%',
    marginTop: 22,
  },

  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tema: {
    backgroundColor: '#E6EFE8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 7,
    marginBottom: 8,
  },

  temaTexto: {
    color: '#315C4C',
    fontSize: 12,
  },

  botonLeer: {
    width: '100%',
    backgroundColor: '#315C4C',
    borderRadius: 13,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },

  botonLeerTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  nota: {
    color: '#85897F',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 14,
  },
});