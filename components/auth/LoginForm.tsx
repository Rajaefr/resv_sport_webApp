'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format d\'email invalide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      setError('Erreur de connexion au serveur');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setError('Veuillez entrer votre email pour réinitialiser le mot de passe');
      return;
    }
    
    // Implement forgot password logic
    router.push(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Administration OCP
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connectez-vous à votre espace d'administration
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ocp.ma"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                disabled={isSubmitting}
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Besoin d'un compte ?{' '}
              <button
                onClick={() => router.push('/auth/register')}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                disabled={isSubmitting}
              >
                Contactez l'administrateur
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
