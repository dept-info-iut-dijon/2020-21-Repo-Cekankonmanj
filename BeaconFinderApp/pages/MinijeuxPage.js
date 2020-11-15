import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import { useTheme } from '@react-navigation/native';

const MinijeuxPage = () => {

  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={styles.container}>
          <Text style={{
            color: colors.text,
            fontSize: 18,
            textAlign: 'center', }}>
            Page des mini-jeux
          </Text>
        </View>
        <Text style={styles.footerHeading}>
          Page en construction
        </Text>
        <Text style={styles.footerText}>Page des mini-jeux</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
  },
  footerHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
  },
});

export default MinijeuxPage;
