import React from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function Libro({
  libro,
  onPress,
  onLeer,
  onGuardar,
  etiquetaGuardar = 'Guardar',
}) {
  return (
    <Pressable
      style={styles.tarjeta}
      onPress={onPress}
    >
      {libro.portada ? (
        <Image
          source={{ uri: libro.portada }}
          style={styles.portada}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.portada, styles.sinPortada]}>
          <Text style={styles.sinPortadaTexto}>
            Sin portada
          </Text>
        </View>
      )}

      <View style={styles.detalles}>
        <Text style={styles.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>

        <Text style={styles.autor} numberOfLines={2}>
          {libro.autor || 'Autor desconocido'}
        </Text>

        <Text style={styles.anio}>
          {libro.anio || 'Año desconocido'}
        </Text>

        <View style={styles.acciones}>
          {!!onPress && (
            <Pressable
              style={styles.botonSecundario}
              onPress={(e) => {
                e.stopPropagation?.();
                onPress();
              }}
            >
              <Text style={styles.botonSecundarioTexto}>
                Detalles
              </Text>
            </Pressable>
          )}

          {!!onLeer && (
            <Pressable
              style={styles.botonLeer}
              onPress={(e) => {
                e.stopPropagation?.();
                onLeer();
              }}
            >
              <Text style={styles.botonLeerTexto}>
                Leer
              </Text>
            </Pressable>
          )}

          {!!onGuardar && (
            <Pressable
              style={styles.botonGuardar}
              onPress={(e) => {
                e.stopPropagation?.();
                onGuardar();
              }}
            >
              <Text style={styles.botonGuardarTexto}>
                ＋ {etiquetaGuardar}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8DF',
  },

  portada: {
    width: 76,
    height: 108,
    borderRadius: 7,
    backgroundColor: '#E8E8DF',
  },

  sinPortada: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },

  sinPortadaTexto: {
    color: '#77796F',
    fontSize: 11,
    textAlign: 'center',
  },

  detalles: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202820',
    marginBottom: 5,
  },

  autor: {
    fontSize: 13,
    color: '#656B63',
    marginBottom: 4,
  },

  anio: {
    fontSize: 12,
    color: '#85897F',
  },

  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
  },

  botonSecundario: {
    backgroundColor: '#E6EFE8',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 6,
    marginBottom: 4,
  },

  botonSecundarioTexto: {
    color: '#315C4C',
    fontSize: 12,
    fontWeight: '700',
  },

  botonLeer: {
    backgroundColor: '#315C4C',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 6,
    marginBottom: 4,
  },

  botonLeerTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  botonGuardar: {
    backgroundColor: '#F0F1EC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
    marginBottom: 4,
  },

  botonGuardarTexto: {
    color: '#315C4C',
    fontSize: 12,
    fontWeight: '700',
  },
});