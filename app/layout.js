import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

// Two bitmap faces: Press Start 2P for the arcade HUD/logo (used tiny and
// sparingly), VT323 for everything you actually read.
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "The Haggle",
  description: "Talk the vendor down. Get scored on your tactics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body>{children}</body>
    </html>
  );
}
