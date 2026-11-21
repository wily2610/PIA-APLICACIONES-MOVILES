import React, { useCallback, useEffect ,useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { limpiarHistorial, obtenerHistorial } from '../../Servicios/BaseDatos';
import Libro from '../../Componenetes/Libros/Libro';

export default function PantallaHistorial() {
  const [libros, setLibros] = useState([]);
  const cargar = useCallback(async () => setLibros(await obtenerHistorial()), []);
  useEffect(() => { cargar(); }, [cargar]);

  const limpiar = () => Alert.alert('Borrar historial', '¿Quieres eliminar todos los registros de libros vistos?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Borrar', style: 'destructive', onPress: async () => { await limpiarHistorial(); cargar(); } },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.cabecera}><View><Text style={styles.titulo}>Historial</Text><Text style={styles.subtitulo}>Libros que has consultado recientemente.</Text></View>
        <Pressable onPress={limpiar}><Text style={styles.limpiar}>Borrar</Text></Pressable>
      </View>
      <FlatList data={libros} keyExtractor={(item) => String(item.historialId)} contentContainerStyle={styles.lista}
        renderItem={({ item }) => <Libro libro={item} onPress={() => Alert.alert(item.titulo, `${item.autor}\nConsultado: ${new Date(item.vistoEn).toLocaleString()}`)} />}
        ListEmptyComponent={<Text style={styles.vacio}>Tu historial está vacío. Cuando abras un libro desde el catálogo aparecerá aquí.</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F2', padding: 16 }, cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: '800', color: '#263A30' }, subtitulo: { color: '#747B71', marginTop: 4 }, limpiar: { color: '#B42318', fontWeight: '700', padding: 8 },
  lista: { paddingBottom: 20 }, vacio: { color: '#747B71', textAlign: 'center', lineHeight: 22, marginTop: 45, paddingHorizontal: 15 },
});
