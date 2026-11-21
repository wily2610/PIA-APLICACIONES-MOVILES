import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import Busqueda from '../../Componenetes/Funcionalidades/Busqueda';

export default function PantallaExplorar() {
  return <SafeAreaView style={styles.container}><Busqueda explorar inicial="subject:fantasy" /></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F7F7F2' } });
