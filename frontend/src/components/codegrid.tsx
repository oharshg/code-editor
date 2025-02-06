import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import axios from "axios";

interface CodeSubmission {
  _id: number;
  title: string;
  language: string;
  code: string;
  author: string;
}

const CodeGrid: React.FC = () => {
  const [mockSubmissions, setMockSubmissions] = useState<CodeSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = () => {
    setLoading(true);
    setError(null);
    return axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/posts`)
      .then((res) => {
        setMockSubmissions(
          res.data.posts.map((post: any) => ({
            ...post,
            key: post._id,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load submissions.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleNum, setVisibleNum] = useState(6);

  const filteredSubmissions = mockSubmissions.filter((submission) =>
    submission.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    if (visibleNum >= filteredSubmissions.length) {
      alert("No more submissions to load");
    }
    setVisibleNum((prevNum) => prevNum + 6);
  };

  return (
    <div className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-primary mb-10">
          Community Submissions
        </h2>
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search code submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: "16px" }}
            className="w-full p-6"
          />
        </div>
        {loading && (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-10 w-10 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2 text-primary">Loading submissions...</span>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.slice(0, visibleNum).map((submission) => (
              <Card
                key={submission._id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle>{submission.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Language: {submission.language}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    By: {submission.author}
                  </p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto h-40 overflow-y-hidden">
                    <code>{submission.code}</code>
                    <p>....</p>
                  </pre>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link
                    to={`/submission/${submission._id}`}
                    className="inline-block"
                  >
                    <Button variant="outline" size="sm">
                      View Complete Submission
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <div className="flex items-center justify-center mt-6">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeGrid;
