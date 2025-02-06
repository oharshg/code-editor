import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { useTheme } from "@/components/theme-provider";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import axios from 'axios';
import Profile from "../components/ui/profile";
import { ModeToggle } from "../components/ui/mode-toggle";
import { Code2 } from "lucide-react";
import { useNavigate} from "react-router-dom";


interface SubmissionData {
  code: string;
  author: string;
  language: string;
}

const Submission = () => {
  const { id } = useParams<{ id: string }>();
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmission = async () => {
      setIsLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${backendUrl}/api/v1/post/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

    fetchSubmission();
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
    <div className="w-[80%] mx-auto">
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
          <Profile />
        </div>
      </div>
      <Card className="mt-4 bg-slate-400 dark:bg-slate-950">
      <CardHeader>
        Submission ID: {id}
      </CardHeader>
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
      <CardHeader>
        Comments
      </CardHeader>
    </Card>
    </div>
  );
};

export default Submission;
