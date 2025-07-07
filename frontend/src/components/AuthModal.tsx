import React, { useState } from 'react';
import { X, User, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          onClose();
          setFormData({ name: '', email: '', password: '' });
        } else {
          setError('Email o contraseña incorrectos. Por favor, verifica tus credenciales.');
        }
      } else {
        if (!formData.name.trim()) {
          setError('El nombre es requerido');
          return;
        }
        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return;
        }
        const success = await signup(formData.name, formData.email, formData.password);
        if (success) {
          onClose();
          setFormData({ name: '', email: '', password: '' });
        } else {
          setError('Ya existe un usuario con este email o ocurrió un error en el servidor.');
        }
      }
    } catch (err) {
      setError('Error de conexión. Por favor, verifica tu conexión a internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border-4 border-black">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? '¡Bienvenido de vuelta!' : '¡Únete a nosotros!'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors border-2 border-black rounded-full p-1"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                  required={!isLogin}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                required
                disabled={isSubmitting}
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border-2 border-red-200">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 border-2 border-black"
            >
              {isLoading || isSubmitting ? (
                <div className="loading-spinner w-5 h-5"></div>
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="ml-2 text-teal-600 hover:text-teal-800 font-semibold transition-colors"
                disabled={isSubmitting}
              >
                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};