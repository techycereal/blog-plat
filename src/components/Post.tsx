import { useParams } from "react-router-dom";
import { useBlog } from "./BlogContext";
import { useEffect, useState, useRef } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { MdMoreVert } from "react-icons/md"; // Import the 3-dot icon
import { FaRegThumbsUp } from "react-icons/fa"; // Import like icon
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Post {
  id: string;
  name: string;
  content: string;
  owner: string;
  likes: number;
}

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const {
    setBlogPosts,
    blogPosts,
    updatePost,
    removePost,
    displayName,
    likePost,
    getPosts,
  } = useBlog();

  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const existingPost = blogPosts.find((post) => post.id === id);
    if (existingPost) {
      setPost(existingPost);
      setFormData({ name: existingPost.name, content: existingPost.content });
    } else if (id) {
      getPosts(id).then((fetchedPost) => {
        setPost(fetchedPost);
        setFormData({ name: fetchedPost.name, content: fetchedPost.content });
      });
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!post) return <div>Loading...</div>;

  const handleEditClick = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleSaveClick = () => {
    if (post) {
      const updatedPost = { ...post, ...formData };
      updatePost(post.id, updatedPost);
      setBlogPosts((prev) =>
        prev.map((p) => (p.id === post.id ? updatedPost : p))
      );
      setPost(updatedPost);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (post) {
      setFormData({ name: post.name, content: post.content });
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id: string) => {
    removePost(id);
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
    navigate("/");
  };

  const handleLike = () => {
    if (post) {
      const updatedLikes = post.likes + 1;
      likePost(post.id, updatedLikes);
      const updatedPost = { ...post, likes: updatedLikes };
      setPost(updatedPost);
      setBlogPosts((prev) =>
        prev.map((p) => (p.id === post.id ? updatedPost : p))
      );
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded shadow">
        {displayName === post.owner && !isEditing && (
          <div className="relative mt-4 flex justify-end">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              <MdMoreVert size={24} />
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-40 z-10"
              >
                <button
                  onClick={handleEditClick}
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}

        {!isEditing ? (
          <>
            <h1 className="text-2xl font-bold">{post.name}</h1>
            <p className="text-gray-600 mt-2">By: {post.owner}</p>
            <p className="text-gray-500 mt-1">Likes: {post.likes}</p>

            <div className="mt-4">
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
            <button
              onClick={handleLike}
              className="block text-left text-blue-600 hover:bg-gray-200 flex items-center gap-2"
            >
              <FaRegThumbsUp size={16} />
              Like
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block w-full p-2 border rounded mt-2"
            />
            <ReactQuill
              value={formData.content}
              onChange={(value) => handleChange("content", value)}
              className="mt-2"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
