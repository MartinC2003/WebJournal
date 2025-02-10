'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

function CreatePlaylistHome() {
    const [message, setMessage] = useState("Loading");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                currentUser.getIdToken().then((idToken) => {
                    fetch("http://localhost:8080/api/home", {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        setMessage(data.message);
                    });
                });
            } else {
                setMessage("User not authenticated");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>{message}</div>
    );
}

export default CreatePlaylistHome;
