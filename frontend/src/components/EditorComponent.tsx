import { useEffect, useRef, useState } from "react";
import Profile from '../components/ui/profile'
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
import { Loader, Play, TriangleAlert } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import { ModeToggle } from "./ui/mode-toggle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupButton from "./ui/signupButton";
import LoginButton from "./ui/loginButton";
export interface CodeSnippetsProps {
  [key: string]: string;
}
export default function EditorComponent() {
  const [showSignup, setShowSignup] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState([]);
  const [err, setErr] = useState(false);
  // const language = languageOption.language;
  // console.log(language);
  const editorRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/user/me`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => {
      console.log(res.status);
      if(res.status == 200){
        setShowSignup(false);
      }
      else{
        setShowSignup(true);
      }
    });
  })


  // console.log(sourceCode);
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
      files: [
        {
          content: sourceCode,
        },
      ],
    };
    try {
      const result = await compileCode(requestData);
      setOutput(result.run.output.split("\n"));
      console.log(result);
      setLoading(false);
      setErr(false);
    } catch (error) {
      setErr(true);
      setLoading(false);
      console.log(error);
    }
  }
  // console.log(languageOption);
  return (
    <div className="min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-8">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
          CompileX
        </h2>
        <div className="flex items-center space-x-2 ">
          <ModeToggle />
          <div className="w-[230px]">
            <SelectLanguages
              onSelect={onSelect}
              selectedLanguageOption={languageOption}
            />
          </div>
          {showSignup && <LoginButton />}
          {showSignup && <SignupButton />}
          {!showSignup && <Profile />}
        </div>
      </div>
      {/* EDITOR  */}
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border dark:bg-slate-900"
        >
          <ResizablePanel defaultSize={50} minSize={35}>
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
            {/* Header */}
            <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
              <div className="flex items-center justify-between  bg-slate-400 dark:bg-slate-950 px-6 py-2">
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
                  <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                    <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-xs">
                      Failed to Compile the Code , Please try again !
                    </p>
                  </div>
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
            {/* Body */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
