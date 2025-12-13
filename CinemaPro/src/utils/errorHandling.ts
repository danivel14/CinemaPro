import { Alert } from 'react-native';

export const errorMessageValidation = (error: any, title: string = "Ocurrió un error") => {
    console.log(`❌ [${title}]`, error);

    let message = "Ha ocurrido un problema inesperado. Intenta de nuevo.";

    if (error.code) {
        switch (error.code) {
            // Errores de Auth
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                message = 'Correo o contraseña incorrectos. Verifica tus datos.';
                break;
            case 'auth/email-already-in-use':
                message = 'Este correo ya está registrado. Intenta iniciar sesión.';
                break;
            case 'auth/weak-password':
                message = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
                break;
            case 'auth/invalid-email':
                message = 'El formato del correo electrónico no es válido.';
                break;
            case 'auth/too-many-requests':
                message = 'Cuenta bloqueada temporalmente por seguridad. Intenta más tarde.';
                break;
            case 'auth/network-request-failed':
                message = 'No tienes conexión a internet.';
                break;
            
            // Errores de Firestore (Base de datos)
            case 'permission-denied':
                message = 'No tienes permisos para realizar esta acción.';
                break;
            case 'unavailable':
                message = 'El servicio no está disponible momentáneamente.';
                break;
                
            default:
                message = error.message || message;
        }
    } else if (typeof error === 'string') {
        message = error;
    }
    Alert.alert(title, message);
};