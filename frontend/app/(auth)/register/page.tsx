"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {signupformSchema as formSchema} from "@/schemas/fromSchema";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const formType = "register";
  type FormData = z.infer<typeof formSchema>;

  // ✅ useForm must be called BEFORE any other logic
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // ✅ Now registerHandler can be defined after useForm
  const registerHandler = async (data: FormData) => {
    try {

      const response = await axios.post(
        "http://localhost:3001/api/v1/auth/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Registration successful!");

      // Handle success (redirect, show message, etc.)
      if (response.status === 200) {
        Cookies.set("token", response.data.data.token, {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        router.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error)) {
        // Axios error with response from server
        if (error.response?.status === 401) {
          toast.error("Check the credentials you provided!");
        }
      }
    }
  };

  const googleLoginHandler = () => {};

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>
              {formType.charAt(0).toUpperCase() + formType.slice(1)} to your
              account
            </CardTitle>
            <CardDescription>
              Enter your email below to {formType} to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(registerHandler)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Anesthesia knight" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="k_anasth01" {...field} />
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
                          placeholder="anasthesia@example.com"
                          {...field}
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
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgetpassword"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    {formType === "register" ? "Register" : "Login"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={googleLoginHandler}
                  >
                    Login with Google
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              {formType === "register"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                href={formType === "register" ? "/login" : "/register"}
                className="underline underline-offset-4"
              >
                {formType === "register" ? "Login" : "Register"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
