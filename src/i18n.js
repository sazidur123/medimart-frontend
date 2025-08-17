import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Home: 'Home',
      Shop: 'Shop',
      Cart: 'Cart',
      'My Profile': 'My Profile',
      Dashboard: 'Dashboard',
      Logout: 'Logout',
      'Update Profile': 'Update Profile',
      'Join Us': 'Join Us',
      'Grand Total': 'Grand Total',
      Checkout: 'Checkout',
      // ...add more keys as needed
    },
  },
  es: {
    translation: {
      Home: 'Inicio',
      Shop: 'Tienda',
      Cart: 'Carrito',
      'My Profile': 'Mi Perfil',
      Dashboard: 'Panel',
      Logout: 'Cerrar sesión',
      'Update Profile': 'Actualizar perfil',
      'Join Us': 'Únete',
      'Grand Total': 'Total',
      Checkout: 'Pagar',
      // ...add more keys as needed
    },
  },
  fr: {
    translation: {
      Home: 'Accueil',
      Shop: 'Boutique',
      Cart: 'Panier',
      'My Profile': 'Mon Profil',
      Dashboard: 'Tableau de bord',
      Logout: 'Déconnexion',
      'Update Profile': 'Mettre à jour',
      'Join Us': 'Rejoignez-nous',
      'Grand Total': 'Total',
      Checkout: 'Paiement',
      // ...add more keys as needed
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
