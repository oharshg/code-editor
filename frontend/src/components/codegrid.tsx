import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CodeSubmission {
  id: number;
  title: string;
  language: string;
  code: string;
  author: string;
  likes: number;
  comments: number;
}

const mockSubmissions: CodeSubmission[] = [
  {
    id: 1,
    title: "Fibonacci Sequence",
    language: "Python",
    code: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)",
    author: "Alice",
    likes: 15,
    comments: 3,
  },
  {
    id: 2,
    title: "Quick Sort",
    language: "JavaScript",
    code: "function quickSort(arr) {\n    if (arr.length <= 1) return arr;\n    const pivot = arr[0];\n    const left = arr.slice(1).filter(x => x < pivot);\n    const right = arr.slice(1).filter(x => x >= pivot);\n    return [...quickSort(left), pivot, ...quickSort(right)];\n}",
    author: "Bob",
    likes: 8,
    comments: 2,
  },
  {
    id: 3,
    title: "Binary Search",
    language: "Java",
    code: "public static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
    author: "Charlie",
    likes: 12,
    comments: 5,
  },
];

const CodeGrid: React.FC = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.slice(0, visibleNum).map((submission) => (
            <Card
              key={submission.id}
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
                <Link
                  to={`/submission/${submission.id}`}
                  className="inline-block mt-4"
                >
                  <Button variant="outline" size="sm">
                    View Complete Submission
                  </Button>
                </Link>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" disabled>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {submission.likes}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {submission.comments}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center mt-6">
          <Button variant="secondary" size="lg" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeGrid;
