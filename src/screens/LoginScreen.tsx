import React, { useContext, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import { colors } from '../styles/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';

import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

import { UserContext } from '../context/UserContext';

type NavigationProp = NativeStackNavigationProp<ParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    try {
      if (!phone || !password) {
        Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại và mật khẩu.');
        return;
      }

      const email = `${phone}@myapp.com`; // Giả lập số điện thoại thành email
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const currentUser = userCredential.user;
      console.log("currentUser:::", currentUser);


      updateUser(currentUser);

      Alert.alert('Thành công', 'Đăng nhập thành công!');
    } catch (error: any) {
      console.log('Login error:', error);
      let message = 'Đăng nhập thất bại. Vui lòng thử lại.';

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Số điện thoại hoặc mật khẩu không đúng.';
          break;
        case 'auth/invalid-email':
          message = 'Số điện thoại không hợp lệ.';
          break;
        default:
          message = error.message || message;
      }

      Alert.alert('Lỗi', message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <View style={{ backgroundColor: '#ffffff' }}>
        <Image
          source={require('../../assets/PrettyFairy2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        secureTextEntry
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Bạn chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: colors.main ?? '#a0006d',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.main ?? '#a0006d',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: colors.main ?? '#a0006d',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 20,
    color: colors.main ?? '#a0006d',
    fontSize: 14,
  },
});
