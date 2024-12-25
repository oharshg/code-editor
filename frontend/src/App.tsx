import { ThemeProvider } from "@/components/theme-provider";
import EditorComponent from "@/components/EditorComponent";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="dark:bg-slate-800 bg-slate-300 p-8 w-screen">
        <EditorComponent />
      </div>
    </ThemeProvider>
  );
}

export default App;
