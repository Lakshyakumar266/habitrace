"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Link } from "lucide-react";
import { Form } from "react-hook-form";

export default function Page() {
  const formType = "login";
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
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
              <Form >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgetpassword"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onSubmit={() => {}}
                    >
                      Login with Google
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  <>
                    Alredy have an account?{" "}
                    <Link
                      href="/login"
                      className="underline underline-offset-4"
                    >
                      Login
                    </Link>
                  </>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
