import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [notfound, setnotFound] = useState(false);
  const navigate = useNavigate();

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
          navigate("/signin");
        });
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`, {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        setLoading(false);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          setInvalid(true);
          setnotFound(false);
        } else if (err.response.status === 404) {
          setnotFound(true);
          setInvalid(false);
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            New here? <Link to="/signup">Sign up</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
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
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {invalid && (
            <div className="text-red-500 text-center font-bold">
              Invalid email or password
            </div>
          )}
          {notfound && (
            <div className="text-red-500 text-center font-bold">
              User not found
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
