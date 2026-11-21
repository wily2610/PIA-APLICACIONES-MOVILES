import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import Busqueda from '../../Componenetes/Funcionalidades/Busqueda';

export default function PantallaDeInicio({ onAbrirLibro }) {
  return (
    <SafeAreaView style={styles.container}>
      <Busqueda
        inicial="subject:fiction"
        onAbrirLibro={onAbrirLibro}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F2',
  },
});