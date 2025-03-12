import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/components/theme-provider";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import Profile from "../components/ui/profile";
import { ModeToggle } from "../components/ui/mode-toggle";
import { Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Profanity } from "@2toad/profanity";
import profanityWords from "../config/profane-words.json";

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

interface Comment {
  id: string;
  text: string;
  authorName: string;
}

interface SubmissionData {
  code: string;
  author: string;
  language: string;
}

const Submission = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profanityFilter = new Profanity();
  profanityFilter.addWords(profanityWords.en);
  profanityFilter.whitelist.addWords(["b", "5"]);

  const [userID, setUserID] = useState("");

  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(
        `${backendUrl}/api/v1/comment/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(
        response.data.comments.map((comment: any) => ({
          id: comment._id,
          text: comment.content,
          authorName: comment.author,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchSubmission = async () => {
      setIsLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(
          `${backendUrl}/api/v1/post/posts/${id}`
        );
        const data = response.data;
        setSubmissionData({
          code: data.post.code,
          author: data.post.author,
          language: data.post.language,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserID(res.data.userID);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });

    fetchSubmission();
    fetchComments();
  }, [id]);

  if (isLoading) {
    return <div>Loading submission...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!submissionData) {
    return <div>Submission not found.</div>;
  }

  return (
    <div className="w-[95%] mx-auto">
      <div className="flex items-center justify-between pb-3 mt-4">
        <div className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <h2
            className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            CompileX
          </h2>
        </div>
        <div className="flex items-center space-x-2 ">
          <ModeToggle />
          {isLoggedIn ? (
            <Profile id={userID} />
          ) : (
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
          )}
        </div>
      </div>
      <Card className="mt-4 bg-slate-400 dark:bg-slate-950">
        <CardHeader>Submission ID: {id}</CardHeader>
        <CardContent>
          <Editor
            height="500px"
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            defaultLanguage={submissionData.language}
            defaultValue={submissionData.code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>Author: {submissionData.author}</div>
          <div>Language: {submissionData.language}</div>
        </CardFooter>
      </Card>
      <Card className="mt-4 bg-slate-400 dark:bg-slate-950">
        <CardHeader>Add a Comment</CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add your comment here"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            className="mt-3"
            onClick={async () => {
              if (!isLoggedIn) {
                setIsLoginModalOpen(true);
                return;
              }

              const commentText = newComment;
              if (!commentText.trim()) {
                alert("Please enter a comment.");
                return;
              }

              if (profanityFilter.exists(commentText)) {
                alert("Please remove profanity from your comment.");
                return;
              }

              try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                await axios.post(
                  `${backendUrl}/api/v1/comment/${id}`,
                  {
                    content: newComment,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setNewComment("");
                // Fetch comments again to update the list
                fetchComments();
              } catch (error: any) {
                console.error("Error posting comment:", error);
              }
            }}
          >
            Post
          </Button>
        </CardContent>
      </Card>
      <Card className="mt-4 bg-slate-400 dark:bg-slate-950">
        <CardHeader>Comments</CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="mt-2 font-bold">No comments yet.</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="mt-2">
                <Card className="mt-2 bg-slate-400 dark:bg-slate-950">
                  <CardHeader className="flex justify-between">
                    <div className="font-bold">
                      Author: {comment.authorName}
                    </div>
                    <div>{comment.text}</div>
                  </CardHeader>
                </Card>
              </div>
            ))
          )}
        </CardContent>
      </Card>
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
    </div>
  );
};

export default Submission;
