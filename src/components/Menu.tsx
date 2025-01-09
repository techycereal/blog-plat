import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "./BlogContext";
import Header from "./Header";

export default function Menu() {
    const { blogPosts, fetchBlogPosts } = useBlog();

    useEffect(() => {
        if (blogPosts.length === 0) {
            fetchBlogPosts();
        }
    }, [blogPosts, fetchBlogPosts]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Header />
            <div className="mt-6">
                {blogPosts.map((post) => (
                    <div
                        key={post.id}
                        className="mt-6 bg-white rounded-lg w-full p-6 shadow-lg hover:shadow-2xl transform transition duration-300 hover:-translate-y-1"
                    >
                        <h2 className="text-xl font-bold text-gray-800">{post.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">By: <span className="font-medium text-gray-700">{post.owner}</span></p>
                        <p className="text-sm text-gray-500 mt-1">Likes: <span className="font-medium text-gray-700">{post.likes}</span></p>
                        <Link
                            to={`/post/${post.id}`}
                            className="mt-4 inline-block bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                        >
                            Read More
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
