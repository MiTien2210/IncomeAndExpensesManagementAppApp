import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {colors} from '../styles/styles';
import {UserContext} from '../context/UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; // hoặc Ionicons, Feather,...

const AboutScreen = () => {
  const {updateUser,user} = useContext(UserContext);
  console.log("user:::",user);
  
  const logout = () => {
    Alert.alert(
      '',
      'Đăng xuất khỏi tài khoản của bạn?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: () => updateUser(null), // Quay về màn hình login
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Icon name="account-circle" size={60} color={colors.primary} />
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email?.replace('@myapp.com',"")}</Text>
      </View>

      <View style={styles.optionGroup}>
        <OptionItem icon="info" label="Giới thiệu ứng dụng" />
        <OptionItem icon="privacy-tip" label="Chính sách bảo mật" />
        <OptionItem icon="settings" label="Cài đặt" />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const OptionItem = ({icon, label}: {icon: string; label: string}) => (
  <TouchableOpacity style={styles.optionItem}>
    <Icon name={icon} size={24} color={colors.primary} />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  optionGroup: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: colors.expense,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
