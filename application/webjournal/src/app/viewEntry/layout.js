"use client";
import { SelectedEntryProvider } from "./context/EntryContext";

export default function RootLayout({ children }) {
  return (
    <SelectedEntryProvider>
      {children}
    </SelectedEntryProvider>
  );
}
