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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.186 29.658 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691c-1.336 2.693-2.127 5.62-2.127 8.693s.791 5.999 2.127 8.693l-5.4-4.24C1.039 29.999 1 27.06 1 24s.039-5.999 1.906-8.458l5.4 4.149z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.819c-1.758 1.314-4.024 2.192-6.219 2.192-4.661 0-8.656-3.138-10.074-7.352l-6.383 4.95C7.818 39.342 15.235 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.14-4.082 5.571l6.19 4.819c3.636-3.344 6.16-8.053 6.16-13.39 0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="mr-2 h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'OAuthAccountNotLinked') {
      setShowErrorDialog(true);
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Blurred Dashboard Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75"
        style={{
          backgroundImage: "url('/images/dashboard-bg (2).png')",
        }}
      />
      
      {/* Overlay for additional blur and darkening effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/90 shadow-2xl border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Continue with an account</CardTitle>
            <CardDescription>
              You must log in or register to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full bg-white/80 hover:bg-white/90 backdrop-blur-sm border-white/20"
              onClick={() => signIn('google', { callbackUrl: "/dashboard" })}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Link href="/login/email" className="block w-full">
              <Button className="w-full bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm">
                <EmailIcon />
                Login with Email
              </Button>
            </Link>
          </div>
          <div className="mt-6 text-center text-sm">
            <Link href="/register" className="text-blue-500 hover:underline">
              New User? Create New Account
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            By continuing, you agree to our Privacy Policy and T&Cs
          </p>
        </CardContent>
      </Card>
      </div>

      {/* Authentication Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Error</AlertDialogTitle>
              <AlertDialogDescription>
                You cannot sign in by Google because you have not registered using it. Sign in by using email and password.
              </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
