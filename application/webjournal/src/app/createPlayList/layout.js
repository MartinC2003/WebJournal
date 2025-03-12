"use client";
import { PlaylistProvider } from "./context/SpotifyContext";
export default function RootLayout({ children }) {
  return (
    <PlaylistProvider>
      {children}
    </PlaylistProvider >
  );
}
