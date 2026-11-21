import React, { useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import PantallaDeInicio from '../Pantallas/Inicio/PantallaDeInicio';
import PantallaExplorar from '../Pantallas/Explorar/PantallaExplorar';
import VentanaLibreria from '../Pantallas/Libreria/VentanaLibreria';
import PantallaAgregar from '../Pantallas/AgregarLibro/PantallaAgregar';
import PantallaHistorial from '../Pantallas/Historial/PantallaHistorial';
import PantallaDetalleLibro from '../Pantallas/Libro/PantallaDetalleLibro';

const PANTALLAS = [
  {
    id: 'Inicio',
    titulo: 'Inicio',
    icono: '⌂',
    Componente: PantallaDeInicio,
  },
  {
    id: 'Explorar',
    titulo: 'Explorar',
    icono: '⌕',
    Componente: PantallaExplorar,
  },
  {
    id: 'Biblioteca',
    titulo: 'Biblioteca',
    icono: '▤',
    Componente: VentanaLibreria,
  },
  {
    id: 'Agregar',
    titulo: 'Agregar',
    icono: '＋',
    Componente: PantallaAgregar,
  },
  {
    id: 'Historial',
    titulo: 'Historial',
    icono: '◷',
    Componente: PantallaHistorial,
  },
];

export default function AppNavegacion() {
  const [actual, setActual] = useState('Inicio');
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [origenDetalle, setOrigenDetalle] = useState('Biblioteca');

  const seleccion = PANTALLAS.find(
    (pantalla) => pantalla.id === actual
  ) || PANTALLAS[0];

  const PantallaActual = seleccion.Componente;

  // Abrir detalles y recordar de dónde venimos.
  const abrirLibro = (libro) => {
    setOrigenDetalle(actual);
    setLibroSeleccionado(libro);
  };

  // Regresar a la pantalla anterior.
  const regresar = () => {
    setLibroSeleccionado(null);
    setActual(origenDetalle);
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.pantalla}>
        {libroSeleccionado ? (
          <PantallaDetalleLibro
            libro={libroSeleccionado}
            onVolver={regresar}
            mostrarBotonLeer={origenDetalle === 'Biblioteca'}
          />
        ) : (
          <PantallaActual
            key={actual}
            onAbrirLibro={abrirLibro}
          />
        )}
      </View>

      {!libroSeleccionado && (
        <View style={styles.barra}>
          {PANTALLAS.map((pantalla) => {
            const activo = actual === pantalla.id;

            return (
              <Pressable
                key={pantalla.id}
                onPress={() => setActual(pantalla.id)}
                style={styles.elemento}
              >
                <Text
                  style={[
                    styles.icono,
                    activo && styles.activo,
                  ]}
                >
                  {pantalla.icono}
                </Text>

                <Text
                  style={[
                    styles.etiqueta,
                    activo && styles.activo,
                  ]}
                >
                  {pantalla.titulo}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F7F7F2',
  },

  pantalla: {
    flex: 1,
  },

  barra: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E8E0',
    paddingBottom: 5,
    paddingTop: 5,
  },

  elemento: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icono: {
    color: '#85897F',
    fontSize: 22,
    lineHeight: 25,
  },

  etiqueta: {
    color: '#85897F',
    fontSize: 10,
    marginTop: 3,
  },

  activo: {
    color: '#315C4C',
    fontWeight: '800',
  },
});