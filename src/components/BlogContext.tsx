import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface BlogPost {
  id: string;
  name: string;
  content: string;
  likes: number;
  owner: string;
}

interface BlogContextType {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  Logout: () => Promise<void>;
  isAuthenticated: boolean;
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  getPosts: (id: string) => Promise<BlogPost>;
  myPosts: () => Promise<BlogPost[]>;
  likePost: (id: string, likes: number) => Promise<void>;
  displayName: string;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
  blogPosts: BlogPost[];
  createBlog: (blog: BlogPost) => void;
  fetchBlogPosts: () => Promise<void>;
  removePost: (id: string) => Promise<void>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider = ({ children }: BlogProviderProps) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [displayName, setDisplayName] = useState<string>(() => {
    const storedDisplayName = localStorage.getItem('displayName');
    return storedDisplayName ? storedDisplayName : '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(localStorage.getItem('displayName') ? true : false);

  useEffect(() => {
    if (displayName) {
      localStorage.setItem('displayName', displayName);
    }
  }, [displayName]);

  const fetchBlogPosts = async (): Promise<void> => {
    const posts: BlogPost[] = [];
    const response = await axios.get<BlogPost[]>('http://localhost:3009/post');
    console.log(response.data);
    posts.push(...response.data);
    setBlogPosts(posts);
  };

  const removePost = async (id: string): Promise<void> => {
    await axios.delete(`http://localhost:3009/post/${id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
    setBlogPosts(prev => {
      const newPrev = [...prev];
      const result = newPrev.filter(acc => acc.id !== id);
      console.log(result);
      return result;
    });
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<void> => {
    console.log(id, updates);
    await axios.put('http://localhost:3009/post', { updates, id }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
    setBlogPosts(prev => {
      const newPrev = [...prev];
      const index = newPrev.findIndex(acc => acc.id === id);
      if (index !== -1) {
        newPrev[index] = { ...newPrev[index], ...updates };
      }
      return newPrev;
    });
  };

  const likePost = async (id: string, likes: number): Promise<void> => {
    await axios.put('http://localhost:3009/like_post', { likes, id });
    setBlogPosts(prev => {
      const newPrev = [...prev];
      const index = newPrev.findIndex(acc => acc.id === id);
      if (index !== -1) {
        newPrev[index] = { ...newPrev[index], likes };
      }
      return newPrev;
    });
  };

  const createBlog = async (blog: BlogPost): Promise<void> => {
    setBlogPosts(prev => [...prev, blog]);
  };

  const myPosts = async (): Promise<BlogPost[]> => {
    const response = await axios.get<BlogPost[]>('http://localhost:3009/myposts', { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
    return response.data;
  };

  const getPosts = async (id: string): Promise<BlogPost> => {
    const response = await axios.get<BlogPost>(`http://localhost:3009/get_post/${id}`);
    console.log(response.data);
    return response.data;
  };

  const Logout = async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('displayName');
    setIsAuthenticated(false);
  };

  return (
    <BlogContext.Provider value={{ setIsAuthenticated, Logout, isAuthenticated, setBlogPosts, getPosts, myPosts, likePost, displayName, setDisplayName, blogPosts, createBlog, fetchBlogPosts, removePost, updatePost }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
