import React from 'react';

import { Text, View, TouchableOpacity } from 'react-native';

import { styles } from './styles';

import LogoSvg from '../../assets/logo.svg';
import { UserPhoto } from '../UserPhoto';

export function Header() {
	return (
    <View style={styles.container}>
      <LogoSvg />

      <UserPhoto imageUri="https://github.com/sam93vasconcelos.png" />
      
      <TouchableOpacity>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
