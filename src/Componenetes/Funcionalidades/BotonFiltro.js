import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function BotonFiltro({ titulo, activo, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.boton, activo && styles.activo]}>
      <Text style={[styles.texto, activo && styles.textoActivo]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: { borderWidth: 1, borderColor: '#D9DED5', borderRadius: 22, paddingVertical: 9, paddingHorizontal: 14, marginRight: 8, marginBottom: 8, backgroundColor: '#FFFFFF' },
  activo: { backgroundColor: '#315C4C', borderColor: '#315C4C' },
  texto: { color: '#49544A', fontSize: 13 },
  textoActivo: { color: '#FFFFFF', fontWeight: '700' },
});
