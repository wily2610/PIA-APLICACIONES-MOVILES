import React, { useCallback, useEffect ,useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, Linking } from 'react-native';
import FormularioLibro from '../../Componenetes/Formularios/FormularioLibro';
import { obtenerLibrosLocales, quitarLibroLocal } from '../../Servicios/BaseDatos';

export default function PantallaAgregar() {
  const [archivos, setArchivos] = useState([]);
  const cargar = useCallback(async () => setArchivos(await obtenerLibrosLocales()), []);
  useEffect(() => { cargar(); }, [cargar]);

  const abrir = async (archivo) => {
    try { await Linking.openURL(archivo.uri); }
    catch { Alert.alert('No se pudo abrir', 'Instala una aplicación compatible con este formato o vuelve a importar el archivo.'); }
  };

  const eliminar = (archivo) => Alert.alert('Eliminar registro', `¿Quitar ${archivo.titulo} de tu biblioteca?`, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Eliminar', style: 'destructive', onPress: async () => { await quitarLibroLocal(archivo.id); cargar(); } },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar libros</Text>
      <Text style={styles.subtitulo}>Importa archivos que ya tengas en tu teléfono.</Text>
      <FormularioLibro onAgregado={cargar} />
      <Text style={styles.seccion}>Mis archivos ({archivos.length})</Text>
      <FlatList data={archivos} keyExtractor={(item) => item.id} contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.archivo}>
            <Text style={styles.icono}>📄</Text>
            <Pressable style={styles.archivoInfo} onPress={() => abrir(item)}><Text style={styles.nombre} numberOfLines={1}>{item.titulo}</Text><Text style={styles.tipo}>{item.mime_type || 'Documento'} · Toca para abrir</Text></Pressable>
            <Pressable onPress={() => eliminar(item)}><Text style={styles.eliminar}>Quitar</Text></Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>Todavía no has importado archivos.</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F2', padding: 16 }, titulo: { fontSize: 24, fontWeight: '800', color: '#263A30' },
  subtitulo: { color: '#747B71', marginTop: 4, marginBottom: 16 }, seccion: { fontSize: 17, fontWeight: '700', color: '#263A30', marginTop: 22, marginBottom: 10 },
  lista: { paddingBottom: 20 }, archivo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 9 },
  icono: { fontSize: 23, marginRight: 10 }, archivoInfo: { flex: 1 }, nombre: { color: '#263A30', fontWeight: '700' }, tipo: { color: '#85897F', fontSize: 11, marginTop: 4 }, eliminar: { color: '#B42318', padding: 8, fontSize: 12 },
  vacio: { textAlign: 'center', color: '#85897F', marginTop: 25 },
});
