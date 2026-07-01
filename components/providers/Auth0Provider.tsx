"use client";

import { Auth0Provider as Auth0ReactProvider } from "@auth0/auth0-react";
import { ReactNode } from "react";

export function Auth0Provider({ children }: { children: ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI;

  if (!domain || !clientId) {
    // If not configured, just render children without provider for now
    console.warn("Auth0 environment variables are not set");
    return <>{children}</>;
  }

  return (
    <Auth0ReactProvider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      {children}
    </Auth0ReactProvider>
  );
}
