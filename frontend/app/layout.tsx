"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./auth/authContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Provider store={store}>{children}</Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
