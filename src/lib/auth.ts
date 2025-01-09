import { signInWithEmailAndPassword, signOut} from "firebase/auth";
import { auth } from "./firebaseConfig";
import axios from "axios";
export const signUp = async (email: string, password: string, displayName: string) => {
    await axios.post('http://localhost:3009/register', {displayName, email, password})
  };
  
  // Sign in function
  export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // Sign out function
  export const logOut = () => {
    return signOut(auth);
  };
  