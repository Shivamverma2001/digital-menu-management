"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 digits"),
  fullName: z.string().min(1, "Full name is required"),
  countryName: z.string().min(1, "Country name is required"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");

  const sendCodeMutation = api.auth.sendCode.useMutation();
  const registerMutation = api.auth.register.useMutation({
    onSuccess: async () => {
      // Small delay to ensure cookie is set in browser before redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Use window.location for full page reload to ensure cookie is available
      window.location.href = "/dashboard";
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      code: "",
      fullName: "",
      countryName: "",
    },
  });

  const handleSendCode = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    try {
      await sendCodeMutation.mutateAsync({ email });
      setCodeSent(true);
      alert("Verification code sent to your email!");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to send verification code";
      alert(errorMessage);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Ensure email is included (use state email if form email is empty)
      const registrationData = {
        ...data,
        email: data.email || email,
      };
      await registerMutation.mutateAsync(registrationData);
    } catch (error: any) {
      const errorMessage = error?.data?.zodError?.fieldErrors || error?.message || "Registration failed";
      alert(typeof errorMessage === "string" ? errorMessage : "Registration failed. Please check your inputs.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValue("email", e.target.value);
                }}
                disabled={codeSent}
              />
              {!codeSent && (
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendCodeMutation.isPending}
                  className="w-full"
                >
                  {sendCodeMutation.isPending ? "Sending..." : "Send Verification Code"}
                </Button>
              )}
            </div>

            {codeSent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...register("code")}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryName">Country Name</Label>
                  <Input
                    id="countryName"
                    type="text"
                    placeholder="United States"
                    {...register("countryName")}
                  />
                  {errors.countryName && (
                    <p className="text-sm text-red-500">{errors.countryName.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full"
                >
                  {registerMutation.isPending ? "Registering..." : "Register"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCodeSent(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Use Different Email
                </Button>
              </>
            )}
          </form>

          <div className="mt-4 text-center text-sm">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

