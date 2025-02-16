import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Code, FileCode2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ProfilePage: React.FC = () => {
  // interface Comment {
  //   postTitle: string;
  //   comments: any;
  // }
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [userData, setUserData] = useState<any>("");
  const [posts, setPosts] = useState<any>([]);
  // const [comments, setComments] = useState<Comment[]>();
  const [loading, setLoading] = useState(true);

  const id = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoginModalOpen(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.user);
        setLoading(false);
      } catch (err) {
        setIsLoginModalOpen(true);
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/posts/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserPosts();

    // const fetchComments = async () => {
    //   setLoading(true);
    //   try {
    //     if (posts.length > 0) {
    //       const commentsarr: Comment[] = [];
    //       posts.forEach(async (post: any) => {
    //         const response = await axios.get(
    //           `${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/comments/${
    //             post._id
    //           }`
    //         );
    //         commentsarr.push({
    //           postTitle: post.title,
    //           comments: response.data.comments,
    //         });
    //       });

    //       setComments(commentsarr);
    //       setLoading(false);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     setLoading(false);
    //   }
    // };

    // fetchComments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLoginModalOpen) {
    return (
      <AlertDialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in or sign up to post a comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/signin")}>
              Log In
            </AlertDialogAction>
            <AlertDialogAction onClick={() => navigate("/signup")}>
              Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="my-4">
        <Navbar />
      </div>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback>
              {(userData.firstName + " " + userData.lastName)
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {userData.firstName + " " + userData.lastName}
            </CardTitle>
            <p className="text-gray-500 flex items-center">
              <FileCode2 size={16} className="mr-1" />
              Total Posts: {posts.length}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Posts</h2>
        </div>
        {/* Add your recent posts here */}
        {posts.length === 0 && (
          <p className="text-gray-500">You have no posts.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post: any) => (
            <Link
              to={`/Submission/${post._id}`}
              style={{ color: "inherit" }}
              key={post._id}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-100 dark:bg-slate-700">
                  <CardTitle className="flex items-center justify-between">
                    {post.title}
                    <Code size={20} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto h-40 overflow-y-hidden mb-4">
                    <code>{post.code}</code>
                    <p>....</p>
                  </pre>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {post.language}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {post.createdAt.slice(0, 10)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* comments here */}
    </div>
  );
};
