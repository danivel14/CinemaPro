import { I18n } from 'i18n-js';

const translations = {
  es: {
    welcome: "Bienvenido",
    login_title: "Iniciar Sesión",
    guest_btn: "Entrar como Invitado",
    email_ph: "Correo Electrónico",
    pass_ph: "Contraseña",
    login_action: "Entrar",
    register_link: "¿No tienes cuenta? Regístrate",
    change_lang: "Change to English",
    change_theme: "Cambiar Tema"
  },
  en: {
    welcome: "Welcome",
    login_title: "Sign In",
    guest_btn: "Guest Login",
    email_ph: "Email Address",
    pass_ph: "Password",
    login_action: "Login",
    register_link: "Don't have an account? Sign up",
    change_lang: "Cambiar a Español",
    change_theme: "Change Theme"
  },
};

const i18n = new I18n(translations);

i18n.locale = 'es'; 
i18n.enableFallback = true; 

export default i18n;