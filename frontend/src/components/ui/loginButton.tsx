import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() => {
          navigate("/signin");
        }}
      >
        Log In
      </Button>
    </div>
  );
}
