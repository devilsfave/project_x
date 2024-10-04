import { StyleSheet } from 'react-native';
import { responsive } from './responsive';

export const typography = StyleSheet.create({
  h1: {
    fontSize: responsive(32),
    fontWeight: 'bold',
  },
  h2: {
    fontSize: responsive(24),
    fontWeight: 'bold',
  },
  h3: {
    fontSize: responsive(20),
    fontWeight: 'bold',
  },
  body: {
    fontSize: responsive(16),
  },
  small: {
    fontSize: responsive(14),
  },
  button: {
    fontSize: responsive(18),
    fontWeight: 'bold',
  },
});
