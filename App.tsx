import 'expo-dev-client';

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NaverMapView from 'react-native-nmap';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <NaverMapView style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

export default memo(App);
