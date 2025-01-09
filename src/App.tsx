import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Menu from './components/Menu'; // Your Menu component
import Create from './components/Create';
import { BlogProvider } from './components/BlogContext';
import Post from './components/Post';
import AuthForm from './components/SignUp';
import SignIn from './components/SignIn';
import Account from './components/Account';
export default function App() {
  return (
    <BlogProvider>
    <BrowserRouter>
    <Routes>
      
      <Route path="/" element={<Menu />} />
      <Route path="/create" element={<Create />} />
      <Route path="/signup" element={<AuthForm />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/account" element={<Account />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
    </BrowserRouter>
    </BlogProvider>
  );
}
