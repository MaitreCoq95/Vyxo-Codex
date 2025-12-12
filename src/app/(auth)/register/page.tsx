'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type Register } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/loading';
import Link from 'next/link';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      company_name: '',
      role: 'operator',
    },
  });

  async function onSubmit(data: Register) {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create company
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: data.company_name,
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // 3. Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            company_id: company.id,
          });

        if (profileError) throw profileError;

        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Inscription réussie !</h1>
              <p className="text-muted-foreground mb-6">
                Veuillez vérifier votre email pour confirmer votre compte.
              </p>
              <Button onClick={() => router.push('/login')} className="w-full">
                Aller à la connexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vyxo Codex
            </h1>
            <p className="text-muted-foreground mt-2">
              Créez votre compte
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                placeholder="Jean Dupont"
                {...form.register('full_name')}
                disabled={isLoading}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-danger mt-1">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                {...form.register('email')}
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-danger mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="company_name">Entreprise</Label>
              <Input
                id="company_name"
                placeholder="Nom de votre entreprise"
                {...form.register('company_name')}
                disabled={isLoading}
              />
              {form.formState.errors.company_name && (
                <p className="text-sm text-danger mt-1">
                  {form.formState.errors.company_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select
                onValueChange={(value) => form.setValue('role', value as any)}
                defaultValue="operator"
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Opérateur</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Directeur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register('password')}
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-danger mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...form.register('confirmPassword')}
                disabled={isLoading}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-danger mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'S\'inscrire'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
