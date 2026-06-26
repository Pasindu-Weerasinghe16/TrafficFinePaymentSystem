import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { validateFine } from '../core/api';

export default function SearchScreen({ navigation }: any) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [officerBadge, setOfficerBadge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!referenceNumber || !categoryId || !officerBadge) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const fineDetails = await validateFine(referenceNumber, categoryId, officerBadge);
      if (fineDetails.isAlreadyPaid) {
        Alert.alert('Notice', 'This fine has already been paid.');
      } else {
        navigation.navigate('Payment', {
          fineDetails,
          referenceNumber,
          categoryId,
          officerBadge,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to validate fine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traffic Fine Payment</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Reference Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ticket reference number"
          value={referenceNumber}
          onChangeText={setReferenceNumber}
        />

        <Text style={styles.label}>Category ID</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Speeding"
          value={categoryId}
          onChangeText={setCategoryId}
        />

        <Text style={styles.label}>Officer Badge Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter officer badge number"
          value={officerBadge}
          onChangeText={setOfficerBadge}
        />

        <TouchableOpacity 
          style={styles.button} 
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});
