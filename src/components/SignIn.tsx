import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../lib/firebaseConfig"; // Adjust import as needed
import { useBlog } from "./BlogContext";
import Header from "./Header";

export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setDisplayName, setIsAuthenticated } = useBlog();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      // Sign in using Firebase Authentication
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Retrieve the ID token (access token)
      const accessToken = await user.getIdToken();

      // Store user details in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("displayName", user.displayName || "Guest");

      // Update context values
      setDisplayName(user.displayName || "Guest");
      setIsAuthenticated(true);

      // Navigate to the home page
      navigate("/");
    } catch (err: any) {
      setError(err.message); // Handle any errors (e.g., wrong password)
    }
  };

  return (
    <div className="bg-gray-100 p-6 overflow-hidden">
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
            {error && (
              <p className="mt-2 text-center text-red-500 text-sm">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
