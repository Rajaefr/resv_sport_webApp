'use client';

import React, { useState } from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import ForgotPasswordForm from './forgot-password-form';
import AuthLayout from './auth-layout'; // Import the new AuthLayout

type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthContainer() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onForgotPassword={() => setCurrentView('forgot-password')}
            onRegisterClick={() => setCurrentView('register')} // New prop for register link
          />
        );
      case 'register':
        return (
          <RegisterForm
            onBack={() => setCurrentView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBack={() => setCurrentView('login')}
          />
        );
      default:
        return <LoginForm onForgotPassword={() => setCurrentView('forgot-password')} onRegisterClick={() => setCurrentView('register')} />;
    }
  };

  return (
    <AuthLayout>
      {renderCurrentView()}
    </AuthLayout>
  );
}
