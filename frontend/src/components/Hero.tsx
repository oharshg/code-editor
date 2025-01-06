import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-primary sm:text-5xl md:text-6xl">
            Welcome to CompileX Community
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Share your code, learn from others, and grow together in our vibrant
            coding community.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button
                className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                onClick={() => navigate("/signin")}
              >
                Start Coding
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
