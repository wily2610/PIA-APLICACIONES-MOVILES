import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import AppNavegacion from './src/Navegacion/AppNavegacion';
import { inicializarBaseDatos } from './src/Servicios/BaseDatos';

export default function App() {
  const [lista, setLista] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    inicializarBaseDatos()
      .then(() => { if (activo) setLista(true); })
      .catch((e) => { if (activo) { setError(e.message || 'No se pudo iniciar la biblioteca.'); setLista(true); } });
    return () => { activo = false; };
  }, []);

  if (!lista) {
    return (
      <View style={styles.carga}>
        <ActivityIndicator size="large" color="#315C4C" />
        <Text style={styles.texto}>Preparando tu biblioteca...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.carga}>
        <Text style={styles.error}>No se pudo iniciar la base de datos: {error}</Text>
      </View>
    );
  }

  return (
    <AppNavegacion />
  );
}

const styles = StyleSheet.create({
  carga: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F2' },
  texto: { marginTop: 12, color: '#315C4C', fontSize: 15 },
  error: { padding: 8, color: '#B42318', backgroundColor: '#FEE4E2' },
});
