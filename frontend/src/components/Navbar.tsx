import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "./ui/profile";
import axios from "axios";

const Navbar = () => {
  const [showSignup, setShowSignup] = useState(true);
  const navigate = useNavigate();
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setShowSignup(false);
            setUserID(res.data.userID);
          } else {
            setShowSignup(true);
          }
        });
    }
  }, []);

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Code2 className="h-6 w-6 text-primary mr-2" />
            <Link
              className="font-bold text-xl text-primary"
              to="/"
              style={{ color: "inherit" }}
            >
              CompileX
            </Link>
          </div>
          <div className="flex space-x-2">
            <ModeToggle />
            <Button
              variant="outline"
              onClick={() => {
                navigate("/editor");
              }}
            >
              Editor
            </Button>
            {showSignup ? (
              <Button onClick={() => navigate("/signin")}>Sign In</Button>
            ) : (
              <Profile id={userID} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
