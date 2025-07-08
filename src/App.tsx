import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { BlogPost } from './components/BlogPost';
import { Footer } from './components/Footer';
import { ActivityView } from './components/ActivityView';
import { Dashboard } from './components/Dashboard';
import { SocialView } from './components/SocialView';
import { useAuth } from './context/AuthContext';
import { postsAPI, activitiesAPI, siteSettingsAPI } from './services/api';
import { FloatingElements, DecorativeSpheres } from './components/FloatingElements';
import { RandomCharacter, RandomCharacterGroup } from './components/RandomCharacter';
import { blogPosts } from './data/blogPosts';
import { Heart, Eye, MessageCircle } from 'lucide-react';

const characterImages = [
  '/12.png',
  '/13.png',
  '/14.png',
  '/15.png',
  '/16.png'
];

function AppContent() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'activities' | 'dashboard' | 'social'>('social');
  const [refreshKey, setRefreshKey] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [homeSettings, setHomeSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load data from API or fallback to default
  useEffect(() => {
    loadData();
  }, [user, refreshKey]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user) {
        // Load user's data from API
        const [postsData, activitiesData, settingsData] = await Promise.all([
          postsAPI.getAll(user.id),
          activitiesAPI.getAll(user.id),
          siteSettingsAPI.getSettings().catch(() => null)
        ]);
        setPosts(postsData.length > 0 ? postsData : []);
        setActivities(activitiesData.length > 0 ? activitiesData : []);
        setHomeSettings(settingsData);
      } else {
        // Use default data for non-authenticated users
        setPosts(blogPosts);
        setActivities([]);
        setHomeSettings(null);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to default data
      setPosts(blogPosts);
      setActivities([]);
      setHomeSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando contenido...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onDataUpdate={handleDataUpdate} />;
      case 'activities':
        return <ActivityView key={refreshKey} />;
      case 'social':
        return <SocialView />;
      case 'home':
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 pt-32 overflow-hidden">
              {/* Elementos decorativos de fondo */}
              <FloatingElements count={8} section="hero" />
              <DecorativeSpheres count={5} />
              <RandomCharacterGroup count={2} className="hidden lg:block" />
              
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
                    {homeSettings?.heroTitle || 'Bienvenidos a Mi Mundo'}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    {homeSettings?.heroDescription || 'Un espacio donde comparto mis pensamientos, experiencias y momentos especiales. Cada historia es una ventana a mi corazón y mis reflexiones sobre la vida.'}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg border-2 border-black relative z-10">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-2xl sm:text-4xl font-bold text-white">MC</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Blog Posts Section */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
              {/* Elementos decorativos para la sección de posts */}
              <FloatingElements count={6} section="posts" />
              <RandomCharacterGroup count={1} className="hidden md:block" />
              
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                    Mis Últimas Reflexiones
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                    Descubre mis pensamientos más recientes y acompáñame en este viaje de autodescubrimiento
                  </p>
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-black">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {user ? 'Aún no has creado ningún post' : 'No hay posts disponibles'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {user ? 'Ve al dashboard para crear tu primer post' : 'Regístrate para ver contenido personalizado'}
                    </p>
                    {user && (
                      <button
                        onClick={() => setCurrentView('dashboard')}
                        className="bg-teal-500 text-white px-6 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors"
                      >
                        Ir al Dashboard
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Personaje aleatorio entre posts */}
                    <div className="flex justify-center my-8">
                      <RandomCharacter size="large" animated={true} />
                    </div>
                    
                    {posts.map((post: any, index: number) => (
                      <div key={`${post._id || post.id}-${refreshKey}`}>
                        <BlogPost
                          post={post}
                          characterImage={characterImages[index % characterImages.length]}
                          index={index}
                        />
                        {/* Personaje aleatorio cada 2 posts */}
                        {(index + 1) % 2 === 0 && index < posts.length - 1 && (
                          <div className="flex justify-center my-12">
                            <RandomCharacter 
                              size="medium" 
                              position={index % 4 === 0 ? 'left' : 'right'}
                              animated={true} 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      <Header 
        onAuthClick={() => setIsAuthModalOpen(true)} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {renderContent()}

      <Footer />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;