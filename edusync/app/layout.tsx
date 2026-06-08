import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduSync | Student Portal",
  description:
    "EduSync — Your modern student portal for courses, assignments, grades, and more.",
  openGraph: {
    title: "EduSync | Student Portal",
    description:
      "Your modern student portal for courses, assignments, grades, and more.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EduSync | Student Portal",
    description:
      "Your modern student portal for courses, assignments, grades, and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Font Awesome for icon parity with original */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
