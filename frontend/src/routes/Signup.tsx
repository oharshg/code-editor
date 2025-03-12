import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Profanity } from "@2toad/profanity";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import profaneWords from "@/config/profane-words.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [alreadyexists, setAlreadyExists] = useState(false);
  const navigate = useNavigate();
  const customProfaneWords = profaneWords as { en: string[] };
  const profanityFilter = new Profanity({
    languages: [
      "ar",
      "zh",
      "en",
      "fr",
      "de",
      "hi",
      "ja",
      "ko",
      "pt",
      "ru",
      "es",
    ],
  });
  profanityFilter.addWords(customProfaneWords.en);
  profanityFilter.whitelist.addWords(["b", "5"]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          navigate("/signup");
        });
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);

    if (
      profanityFilter.exists(data.firstName) ||
      profanityFilter.exists(data.lastName)
    ) {
      toast.error(
        "Profanity detected! Please remove profane words from your first and last name."
      );
      setLoading(false);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 409) {
          setAlreadyExists(true);
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Already have an account? <Link to="/signin">Log In</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="johndoe@gmail.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="******"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {alreadyexists && (
            <div className="text-red-500 text-center font-bold">
              Email already exists
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
