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
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function EmailLoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      alert('Invalid email or password');
    } else {
      window.location.href = '/dashboard';
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Blurred Dashboard Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75"
        style={{
          backgroundImage: "url('/images/dashboard-bg.png')",
        }}
      />
      
      {/* Overlay for additional blur and darkening effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/90 shadow-2xl border-white/20">
          <CardHeader>
            <Link
              href="/login"
              className="text-sm text-blue-500 hover:underline"
            >
              &larr; Back
            </Link>
            <CardTitle className="pt-4 text-2xl">Login with Email</CardTitle>
            <CardDescription>
              Enter your email and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <Link
              href="/register"
              className="text-blue-500 hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
