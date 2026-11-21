import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { agregarLibroLocal } from '../../Servicios/BaseDatos';

export default function FormularioLibro({ onAgregado }) {
  const [cargando, setCargando] = useState(false);

  const seleccionarArchivo = async () => {
    try {
      setCargando(true);
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/epub+zip'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (resultado.canceled || !resultado.assets?.length) return;
      const archivo = resultado.assets[0];
      await agregarLibroLocal(archivo);
      Alert.alert('Libro agregado', `${archivo.name} se agregó a tus libros locales.`);
      onAgregado?.();
    } catch (e) {
      Alert.alert('No se pudo agregar', e.message || 'Ocurrió un error al importar el archivo.');
    } finally { setCargando(false); }
  };

  return (
    <View style={styles.tarjeta}>
      <View style={styles.icono}><Text style={styles.iconoTexto}>⇧</Text></View>
      <Text style={styles.titulo}>Importar desde tu teléfono</Text>
      <Text style={styles.descripcion}>Selecciona un archivo PDF, EPUB o TXT desde el almacenamiento de Android.</Text>
      <Pressable style={styles.boton} onPress={seleccionarArchivo} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.botonTexto}>Seleccionar archivo</Text>}
      </Pressable>
      <Text style={styles.nota}>Los archivos se registran en tu biblioteca local. Para PDF y EPUB se abrirá una aplicación lectora compatible del teléfono.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#E5E8E0' },
  icono: { width: 58, height: 58, borderRadius: 16, backgroundColor: '#E6EFE8', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  iconoTexto: { fontSize: 34, color: '#315C4C' },
  titulo: { fontSize: 19, fontWeight: '800', color: '#263A30', marginBottom: 8 },
  descripcion: { fontSize: 14, lineHeight: 21, color: '#6E756C', marginBottom: 18 },
  boton: { backgroundColor: '#315C4C', padding: 14, borderRadius: 12, alignItems: 'center' },
  botonTexto: { color: '#FFFFFF', fontWeight: '700' },
  nota: { color: '#8A9087', fontSize: 11, lineHeight: 17, marginTop: 14 },
});
