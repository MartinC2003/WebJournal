"use client"
import React, { useContext, useState } from "react";

const PlaylistProviderContext = React.createContext();

export const PlaylistProvider = ({children}) => {
    const [playlist, setPlaylist] = useState(null);

    const removePlaylist = async() => {
        setPlaylist(null);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("playlist");
        }
    };

    const getPlaylist = async(playlistId)=> {
        setPlaylist(playlistId)
        if (typeof window !== "undefined") {
            window.localStorage.setItem("playlist", playlistId);
            
        }
    };
    
    return(
        <PlaylistProviderContext.Provider value={{playlist, getPlaylist, removePlaylist}}>
            {children}
        </PlaylistProviderContext.Provider>
    );
};
export const usePlaylist = () => useContext(PlaylistProviderContext)