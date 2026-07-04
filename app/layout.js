import { Karla, Permanent_Marker, Space_Mono } from "next/font/google";
import "./globals.css";

const karla = Karla({ subsets: ["latin"], variable: "--font-body" });
const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "The Haggle",
  description: "Talk the vendor down. Get scored on your tactics.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${marker.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
