import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

export async function isBiometricAvailable() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch (e) {
    console.warn('Biometric availability check failed:', e);
    return false;
  }
}

export async function authenticateWithFingerprint() {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('Fingerprint authentication is supported on mobile devices.');
  }

  try {
    const isAvailable = await isBiometricAvailable();
    if (!isAvailable) {
      throw new Error('Fingerprint sensor is not available or not enrolled on this Android device.');
    }

    // Trigger native Android BiometricPrompt
    await NativeBiometric.verifyIdentity({
      reason: 'Scan fingerprint to access Kanha Door House ERP',
      title: 'Fingerprint Authentication',
      subtitle: 'Kanha Door House Field & Admin Portal',
      description: 'Touch the fingerprint sensor to verify identity',
      maxAttempts: 3,
    });

    return true;
  } catch (err) {
    console.error('Biometric authentication failed:', err);
    throw err;
  }
}

export function getSavedBiometricUser() {
  try {
    const stored = localStorage.getItem('kdh_biometric_user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

export function saveBiometricUser(user) {
  try {
    localStorage.setItem('kdh_biometric_user', JSON.stringify(user));
  } catch (e) {}
}

export function clearBiometricUser() {
  try {
    localStorage.removeItem('kdh_biometric_user');
  } catch (e) {}
}
