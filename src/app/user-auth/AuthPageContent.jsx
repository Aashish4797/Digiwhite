'use client';

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useSearchParams } from 'next/navigation';

export default function AuthPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    localStorage.removeItem("hasShownWelcome");

    const error = searchParams.get("error");
    if (error) {
      const errorMessages = {
        'AccessDenied': 'Access was denied. Please make sure to grant the necessary permissions.',
        'Configuration': 'There is a problem with the server configuration.',
        'Default': 'An error occurred during authentication. Please try again.'
      };
      toast.error(errorMessages[error] || errorMessages.Default);
    }
  }, [searchParams]);

  const handleLogin = async (provider) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Failed to login with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
      {isLoading && <Loader />}
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <Image
          src="/images/meet_image.jpg"
          width={1080}
          height={1080}
          alt="login_image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col justify-center w-full p-8 lg:w-1/2">
        <div className="max-w-md mx-auto">
          <h1 className="mb-4 text-4xl font-bold">
            Welcome to Digital Whiteboard 2.0
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-100">
            "Seamlessly connect with your team anytime, anywhere. Host or join meetings with HD video and crystal-clear audio."
          </p>
          <div className="space-y-4">
            <Button
              className="w-full dark:hover:bg-white dark:hover:text-black"
              variant="outline"
              onClick={() => handleLogin("google")}
            >
              <GoogleIcon />
              Login with Google
            </Button>
          </div>
          <div className="flex flex-col space-y-4 mt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-500 dark:border-gray-600"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-gray-800">Or</span>
              </div>
            </div>
            <Button
              className="w-full bg-black text-white dark:hover:bg-gray-200 dark:bg-white dark:text-black"
              variant="ghost"
              onClick={() => handleLogin('github')}
            >
              <Github className="w-5 h-5 mr-2" />
              Login with GitHub
            </Button>
            <p className="text-sm text-center text-gray-900 dark:text-gray-400">
              Start with Google/GitHub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
