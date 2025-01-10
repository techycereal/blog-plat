import { useEffect, useState } from 'react';
import { useBlog } from './BlogContext';
import { Link } from 'react-router-dom';
import Header from './Header';

interface Post {
  id: string;
  name: string;
  content: string;
  owner: string;
}

export default function Account() {
  const { myPosts } = useBlog();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await myPosts();
        setPosts(result);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [myPosts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
        {/* Add a spinner or loading indicator */}
      </div>
    );
  }

  return (
    <div className='overflow-x-hidden p-6 bg-gray-100 min-h-screen'>
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="w-full bg-white rounded-lg p-6 mb-4 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800">{post.name}</h3>
              <div className="mt-4 text-sm text-gray-500">By: {post.owner}</div>
              <Link
                to={`/post/${post.id}`}
                className="text-blue-500 hover:underline mt-2"
              >
                Read More
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
