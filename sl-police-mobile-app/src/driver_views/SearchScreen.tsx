import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { validateFine } from '../core/api';

export default function SearchScreen({ navigation }: any) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [officerBadge, setOfficerBadge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const cleanReferenceNumber = referenceNumber.trim();
    const cleanCategoryId = categoryId.trim();
    const cleanOfficerBadge = officerBadge.trim();

    if (!cleanReferenceNumber || !cleanCategoryId || !cleanOfficerBadge) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericCategoryId = Number(cleanCategoryId);
    if (!Number.isInteger(numericCategoryId) || numericCategoryId <= 0) {
      Alert.alert('Error', 'Category ID must be a positive number');
      return;
    }

    setLoading(true);
    try {
      const fineDetails = await validateFine(
        cleanReferenceNumber,
        numericCategoryId,
        cleanOfficerBadge
      );
      if (fineDetails.isAlreadyPaid) {
        Alert.alert('Notice', 'This fine has already been paid.');
      } else {
        navigation.navigate('Payment', {
          fineDetails,
          referenceNumber: cleanReferenceNumber,
          categoryId: numericCategoryId,
          officerBadge: cleanOfficerBadge,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to validate fine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Traffic Fine Payment</Text>
        <Text style={styles.subtitle}>Enter the details printed on your fine ticket.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Reference Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ticket reference number"
            autoCapitalize="characters"
            value={referenceNumber}
            onChangeText={setReferenceNumber}
          />

          <Text style={styles.label}>Category ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter numeric category ID"
            keyboardType="number-pad"
            value={categoryId}
            onChangeText={setCategoryId}
          />

          <Text style={styles.label}>Officer Badge Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter officer badge number"
            autoCapitalize="characters"
            value={officerBadge}
            onChangeText={setOfficerBadge}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Validate Fine</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: -20,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
