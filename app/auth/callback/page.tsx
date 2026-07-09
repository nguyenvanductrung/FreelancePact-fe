"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";

export default function AuthCallbackPage() {
  const { isLoading, isAuthenticated, error, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function processAuth() {
      if (isLoading || isProcessing) return;

      if (error) {
        setAuthError(error.message);
        return;
      }

      const code = searchParams.get("code");
      
      if (!isAuthenticated && !code) {
        // Not authenticated and no code in URL, redirect to login
        router.replace("/login");
        return;
      }

      if (code) {
        setIsProcessing(true);
        try {
          // Attempt to login using the code flow
          const res = await authApi.auth0Login(code);
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          router.replace("/contracts");
        } catch (err: any) {
          console.error("Auth0 login error:", err);
          setAuthError(err.message || "Failed to authenticate with Auth0");
        } finally {
          setIsProcessing(false);
        }
      } else if (isAuthenticated) {
        // If somehow authenticated but no code, we might need a different approach or just token
        // This is a fallback if code is missing but SDK says authenticated
        setIsProcessing(true);
        try {
          const accessToken = await getAccessTokenSilently();
          // We can use googleLogin endpoint temporarily if auth0 needs token instead of code
          // But our plan says auth0Login expects code.
          // Let's assume code flow is primary and we don't land here if code flow works
          setAuthError("No authorization code found in URL.");
        } catch (err: any) {
          setAuthError("Failed to retrieve access token");
        } finally {
          setIsProcessing(false);
        }
      }
    }

    processAuth();
  }, [isLoading, isAuthenticated, error, router, searchParams, getAccessTokenSilently, isProcessing]);

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-500">Authentication Error</h2>
          <p className="text-zinc-400">{authError}</p>
          <button
            onClick={() => router.replace("/login")}
            className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p className="text-zinc-400">Completing authentication...</p>
    </div>
  );
}
