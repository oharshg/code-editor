import { useEffect, useRef, useState } from "react";
import Profile from "../components/ui/profile";
import SelectLanguages, {
  selectedLanguageOptionProps,
} from "@/components/ui/SelectLanguages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./ui/button";
import { Loader, Play } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import { ModeToggle } from "./ui/mode-toggle";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Code2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export interface CodeSnippetsProps {
  [key: string]: string;
}
export default function EditorComponent() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState([]);
  const [err, setErr] = useState(false);
  const editorRef = useRef(null);
  const [input, setInput] = useState("");
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }
    const checkOrientation = () => {
      const vertical = window.innerHeight > window.innerWidth;
      setIsVertical(vertical);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  });

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.focus();
  }
  function handleOnchange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
    }
  }
  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
  }

  async function executeCode() {
    setLoading(true);
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      stdin: input,
      files: [
        {
          content: sourceCode,
        },
      ],
    };
    try {
      const result: any = await compileCode(requestData);
      if (result.run.stderr != "") {
        setErr(true);
        setLoading(false);
        setOutput(result.run.stderr.split("\n"));
      } else {
        setOutput(result.run.output.split("\n"));
        setLoading(false);
        setErr(false);
      }
    } catch (error) {
      setErr(true);
      setLoading(false);
      console.log(error);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>You are not logged in</CardTitle>
            <CardDescription>
              Don't have an account? <a href="/signup">Sign up</a>
            </CardDescription>
          </CardHeader>
          <CardContent>Login to CompileX to get started</CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Back
            </Button>
            <Button onClick={() => navigate("/signin")}>Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isVertical) {
    return (
      <div className="min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-3">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
              CompileX
            </h2>
          </div>
          <div className="flex items-center space-x-2 ">
            <ModeToggle />
            <Profile />
          </div>
        </div>
        <div className="bg-slate-400 dark:bg-slate-950 p-2 rounded-2xl">
          <div className="div">
            <div className="flex items-center justify-between bg-slate-400 dark:bg-slate-950 py-2">
              <div className="w-[199px]">
                <SelectLanguages
                  onSelect={onSelect}
                  selectedLanguageOption={languageOption}
                />
              </div>
              <div className="flex space-x-1 pl-2">
                <Button
                  size={"sm"}
                  className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                >
                  Share
                </Button>
              </div>
            </div>
            <Editor
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              height="100vh"
              defaultLanguage={languageOption.language}
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              value={sourceCode}
              onChange={handleOnchange}
              language={languageOption.language}
              options={{
                fontSize: 13,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
          <div className="div">
            <div className="space-y-3 bg-slate-300 dark:bg-slate-900">
              <div className="flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-6 py-3">
                <h2>Input</h2>
              </div>
              <div className="px-3 py-1 pb-3">
                <Textarea
                  className="resize-none min-h-[180px]"
                  placeholder="Give input here..."
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="div">
            <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-[500px]">
              <div className="flex items-center justify-between  bg-slate-400 dark:bg-slate-950 px-6 py-3">
                <h2>Output</h2>
                {loading ? (
                  <Button
                    disabled
                    size={"sm"}
                    className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                  >
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span>Running please wait...</span>
                  </Button>
                ) : (
                  <Button
                    onClick={executeCode}
                    size={"sm"}
                    className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                  >
                    <Play className="w-4 h-4 mr-2 " />
                    <span>Run</span>
                  </Button>
                )}
              </div>
              <div className=" px-6 space-y-2">
                {err ? (
                  <>
                    {output.map((item) => {
                      return (
                        <p className="text-sm text-red-600" key={item}>
                          {item}
                        </p>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {output.map((item) => {
                      return (
                        <p className="text-sm" key={item}>
                          {item}
                        </p>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-8">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
            CompileX
          </h2>
        </div>
        <div className="flex items-center space-x-2 ">
          <ModeToggle />
          <Profile />
        </div>
      </div>
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border dark:bg-slate-900"
        >
          <ResizablePanel defaultSize={50} minSize={35}>
            <div className="flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-3 py-2">
              <div className="w-[230px]">
                <SelectLanguages
                  onSelect={onSelect}
                  selectedLanguageOption={languageOption}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  size={"sm"}
                  className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                >
                  Share
                </Button>
                <Button
                  size={"sm"}
                  className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                >
                  Save
                </Button>
              </div>
            </div>
            <Editor
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              height="100vh"
              defaultLanguage={languageOption.language}
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              value={sourceCode}
              onChange={handleOnchange}
              language={languageOption.language}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={35}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65} minSize={65} maxSize={65} id="1">
                <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
                  <div className="flex items-center justify-between  bg-slate-400 dark:bg-slate-950 px-6 py-3">
                    <h2>Output</h2>
                    {loading ? (
                      <Button
                        disabled
                        size={"sm"}
                        className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                      >
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        <span>Running please wait...</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={executeCode}
                        size={"sm"}
                        className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                      >
                        <Play className="w-4 h-4 mr-2 " />
                        <span>Run</span>
                      </Button>
                    )}
                  </div>
                  <div className=" px-6 space-y-2">
                    {err ? (
                      <>
                        {output.map((item) => {
                          return (
                            <p className="text-sm text-red-600" key={item}>
                              {item}
                            </p>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {output.map((item) => {
                          return (
                            <p className="text-sm" key={item}>
                              {item}
                            </p>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </ResizablePanel>
              <ResizablePanel defaultSize={35} minSize={35} maxSize={35} id="2">
                <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
                  <div className="flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-6 py-3">
                    <h2>Input</h2>
                  </div>
                  <div className="px-3 py-1">
                    <Textarea
                      className="resize-none min-h-[180px]"
                      placeholder="Give input here..."
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
