import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the snow theme CSS
import { useBlog } from './BlogContext'; // Importing useBlog context
import Header from './Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Create() {
    const { createBlog, fetchBlogPosts, isAuthenticated } = useBlog(); // Get isAuthenticated from the context
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!isAuthenticated) return; // Prevent submitting if not authenticated

        const response = await axios.post('http://localhost:3009/post', {
            name: title,
            content,
            likes: 0
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });

        console.log(response.data);
        createBlog(response.data);
        navigate('/account');
    };

    return (
        <div className='overflow-x-hidden p-6 bg-gray-100 min-h-screen'>
            <Header />
            <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded shadow">
                { !isAuthenticated ? (
                    <div className="text-center">
                    <p className="text-red-500 mb-4">You must have an account to post.</p>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        onClick={() => navigate('/signin')}
                    >
                        Sign In
                    </button>
                </div>
                ) :
                <>
                <h1 className="text-2xl font-bold mb-4">Create a New Blog Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the blog title"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <ReactQuill
                            id="content"
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            placeholder="Write your blog content here..."
                            className="bg-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isAuthenticated} // Disable button if not authenticated
                    >
                        Publish
                    </button>
                </form>
                </>
                }
                
            </div>
        </div>
    );
}
