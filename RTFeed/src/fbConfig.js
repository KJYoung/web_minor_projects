import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

// import "firebase/compat/firestore";
// import "firebase/compat/storage";

// RTFeed's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID,
  };

export const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);
export const authCreateUser = createUserWithEmailAndPassword;
export const authLogIn = signInWithEmailAndPassword;
export const onAuthChange = onAuthStateChanged;

// Social Login
export const authGoogleProvider = GoogleAuthProvider;
export const authGithubProvider = GithubAuthProvider;
export const authSignUpWithPopUp = signInWithPopup;

// Log Out
export const authLogOut = signOut;