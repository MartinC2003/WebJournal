"use client";
import React, { useContext, useState } from "react";

const SelectedEntryContext = React.createContext();

export const SelectedEntryProvider = ({ children }) => {
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const removeEntry = async () => {
    setSelectedEntryId(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("entry-id");
    }
  };

  const setEntry = async (id) => { 
    try {
      setSelectedEntryId(id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("entry-id", id);
      }
    } catch (error) {
      console.error("Error setting entry:", error);
    }
  };

  return (
    <SelectedEntryContext.Provider value={{ selectedEntryId, setEntry, removeEntry }}>
      {children}
    </SelectedEntryContext.Provider>
  );
};

export const useSelectedEntry = () => useContext(SelectedEntryContext); // FIXED: Proper hook usage
