import { ThemeProvider } from "@/components/theme-provider";
import EditorComponent from "@/components/EditorComponent";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Signin} from "./routes/Signin";
import { Signup } from "./routes/Signup";

function App() {
  return (
    <div className="dark:bg-slate-800 bg-slate-300 p-8 w-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EditorComponent/>} ></Route>
            <Route path="/signin" element={<Signin/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
