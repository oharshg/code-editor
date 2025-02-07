import { ThemeProvider } from "@/components/theme-provider";
import EditorComponent from "@/components/EditorComponent";
import { Routes, Route, Navigate, Outlet, HashRouter } from "react-router-dom";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import Community from "./routes/Community";
import Submission from "./routes/Submission";

const AppLayout = () => {
  return (
    <div className="dark:bg-slate-800 bg-slate-300 p-3 w-screen h-full">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Community />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
          <Route element={<AppLayout />}>
            <Route path="/editor" element={<EditorComponent />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/Submission/:id" element={<Submission />}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
