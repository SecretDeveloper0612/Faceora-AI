import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';

export function EmailSignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  
  const dispatch = useDispatch();

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    setErrorMsg(null);
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
      } else if (data.user) {
        dispatch(setUser({
          id: data.user.id,
          email: data.user.email || '',
        }));
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/Faceora App Logo circle.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
              {/* <Text style={styles.logoText}>Faceora AI</Text> */}
            </View>

            <Text style={styles.title}>Sign in with Email</Text>

            {errorMsg && (
              <Animated.View 
                entering={FadeInDown.duration(400)} 
                exiting={FadeOutUp.duration(300)}
                style={styles.errorBanner}
              >
                <View style={styles.errorIconContainer}>
                  <AlertCircle size={20} color="#FF3B30" />
                </View>
                <View style={styles.errorTextContainer}>
                  <Text style={styles.errorTitle}>Sign In Failed</Text>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              </Animated.View>
            )}

            <TouchableOpacity 
              activeOpacity={1} 
              style={[styles.inputWrapper, { marginBottom: 16 }]}
              onPress={() => emailInputRef.current?.focus()}
            >
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.inputWrapper}
              onPress={() => passwordInputRef.current?.focus()}
            >
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#8A8A8E" />
                  ) : (
                    <Eye size={20} color="#8A8A8E" />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

          </View>

          {/* Bottom Container */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.continueButton, 
                (!email || !password || isLoading) && styles.continueButtonDisabled
              ]} 
              onPress={handleContinue}
              disabled={!email || !password || isLoading}
            >
              <LinearGradient
                colors={['#8C776B', '#635147']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.continueButtonText}>
                {isLoading ? 'Signing in...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD1D1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#8A2020',
    lineHeight: 20,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 72,
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8A8E',
    marginBottom: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    color: '#1C1C1E',
    padding: 0, 
    fontWeight: '500',
    height: 24,
  },
  eyeIcon: {
    padding: 4,
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
