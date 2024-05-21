import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { UserAuth } from '../../api/AuthContext';
import { useRouter } from 'next/navigation';

function NewEntry() {
  const { user } = UserAuth();
  const [entry, setEntry] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: '',
    mood: '',
    text: '',
  });
  const router = useRouter();

  const handleInput = (e) => {
    e.persist();
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleMoodSelect = (e) => {
    setEntry({ ...entry, mood: e.target.value });
  };

  const addEntry = async (e) => {
    e.preventDefault();

    try {
      if (entry.title !== '' && entry.mood !== '' && entry.text !== '') {
        const collectionRef = collection(db, 'DairyEntries');

        await addDoc(collection(db, 'DairyEntries'), {
          date: new Date().toISOString().slice(0, 10),
          title: entry.title.trim(),
          mood: entry.mood.trim(),
          text: entry.text.trim(),
          userUid: user.uid,
        });

        setEntry({
          date: new Date().toISOString().slice(0, 10),
          title: '',
          mood: '',
          text: '',
        });

        console.log('Entry successfully saved to Firestore!');
        router.push('/viewEntry');
      } else {
        console.log('Please fill in all fields');
        window.alert('Please fill in all fields');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      window.alert(`Error adding entry: ${error.message}`);
    }
  };

  return (
    <div
      className="bg-cover bg-[url('/newjournalpg.gif')] bg-center bg-no-repeat h-screen"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card-body">
        <form className="text-center" onSubmit={addEntry}>
          <div className="row mb-3">
            <div className="col">
              <input
                placeholder="Title"
                type="text"
                name="title"
                value={entry.title}
                onChange={handleInput}
                className="form-control"
                style={{
                  color: 'white',
                  border: 'none',
                  borderBottom: '2px solid white',
                  background: 'transparent',
                  outline: 'none',
                  marginBottom: '10px',
                }}
              />
            </div>
            <div className="col">
              <select
                name="mood"
                value={entry.mood}
                onChange={handleMoodSelect}
                className="form-control"
                style={{ color: 'black' }}
              >
                <option value="">Im feeling very...</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Angry">Angry</option>
                <option value="Bored">Bored</option>
                <option value="Neutral">Neutral</option>
                <option value="Scared">Scared</option>
                <option value="Annoyed">Annoyed</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <textarea
              name="text"
              value={entry.text}
              onChange={handleInput}
              className="form-control"
              rows="8"
              style={{
                width: '500px',
                height: '300px',
                color: 'black',
                padding: '20px',
              }}
              placeholder="And I wanna talk about how..."
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              style={{
                border: '1px solid',
                padding: '10px 20px',
                borderRadius: '5px',
              }}
              className="btn btn-primary"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewEntry;
