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
import { processPayment } from '../core/api';

export default function PaymentScreen({ route, navigation }: any) {
  const { fineDetails, referenceNumber, categoryId, officerBadge } = route.params;
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  const handlePayment = async () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const cleanLocation = location.trim();

    if (!cleanLocation || !cleanCardNumber || !expiry.trim() || !cvv) {
      Alert.alert('Error', 'Please enter the location and all payment details');
      return;
    }

    if (!/^\d{12,19}$/.test(cleanCardNumber)) {
      Alert.alert('Error', 'Enter a valid card number');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) {
      Alert.alert('Error', 'Expiry must use MM/YY format');
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      Alert.alert('Error', 'Enter a valid CVV');
      return;
    }

    setLoading(true);
    try {
      const result = await processPayment({
        referenceNumber,
        categoryId,
        officerBadgeNumber: officerBadge,
        location: cleanLocation,
        paymentDetails: {
          method: 'CARD',
          cardNumber: cleanCardNumber,
          expiry: expiry.trim(),
          cvv,
        },
      });

      if (result.success) {
        navigation.replace('Success', {
          receiptNumber: result.receiptNumber,
          referenceNumber,
          amount: fineDetails.amount,
        });
      } else {
        Alert.alert('Error', 'Payment failed to process');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment processing error');
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
        <Text style={styles.title}>Payment Details</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Fine Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Reference:</Text>
            <Text style={styles.value}>{referenceNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{fineDetails.categoryName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.amount}>Rs. {fineDetails.amount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Violation Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Colombo Fort or GPS coordinates"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.cardTitle}>Credit/Debit Card</Text>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            maxLength={23}
            value={cardNumber}
            onChangeText={setCardNumber}
          />

          <View style={styles.cardRow}>
            <TextInput
              style={[styles.input, styles.halfInput, styles.leftInput]}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              onChangeText={handleExpiryChange}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Pay Rs. {fineDetails.amount}</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
  },
  leftInput: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
