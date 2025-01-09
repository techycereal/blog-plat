import { signInWithEmailAndPassword, signOut} from "firebase/auth";
import { auth } from "./firebaseConfig";
import axios from "axios";
export const signUp = async (email: string, password: string, displayName: string) => {
    await axios.post('https://blogback-ejhddzbrgccehabb.westus2-01.azurewebsites.net/register', {displayName, email, password})
  };
  
  // Sign in function
  export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // Sign out function
  export const logOut = () => {
    return signOut(auth);
  };
  