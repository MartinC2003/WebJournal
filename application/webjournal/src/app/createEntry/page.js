'use client';
import React from 'react';
import NewEntry from './create-entry';
import { UserAuth } from '../../api/AuthContext';
const CreateEntryPage = () => {
    const { user } = UserAuth();

    if (!user) {
        return (
            <div>
                <p>Please log in to create an entry.</p>
            </div>
        );
    }

    return (
        <div>
            <NewEntry />
        </div>
    );
}

export default CreateEntryPage;
