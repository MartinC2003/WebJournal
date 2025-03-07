import { addDoc, collection } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CeIcon from '../../../public/icons/CeIcon.svg';
import { UserAuth } from '../../api/AuthContext';
import { db } from '../../api/firebase';
import styles from '../styles/createentry.module.css';

function NewEntry() {
  const router = useRouter();
  const { user } = UserAuth();
  const [entry, setEntry] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: '',
    mood: '',
    text: '',
    tracks: [
      { artist: '', trackTitle: '' }
    ]
  });

  const handleTrackInput = (index, field, value) => {
    const newTracks = [...entry.tracks];
    newTracks[index][field] = value;
    setEntry({ ...entry, tracks: newTracks });
  };

  const addTrack = () => {
    setEntry({
      ...entry,
      tracks: [...entry.tracks, { artist: '', trackTitle: '' }]
    });
  };

  const removeTrack = (index) => {
    const newTracks = entry.tracks.filter((_, i) => i !== index);
    setEntry({ ...entry, tracks: newTracks });
  };

  const handleInput = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleMoodSelect = (e) => {
    setEntry({ ...entry, mood: e.target.value });
  };

  const addEntry = async (e) => {
    e.preventDefault();

    if (entry.title !== '' && entry.mood !== '' && entry.text !== '') {
      const allTracksFilled = entry.tracks.every(track => track.artist !== '' && track.trackTitle !== '');

      if (allTracksFilled) {
        try {
          await addDoc(collection(db, 'DairyEntries'), {
            date: entry.date,
            title: entry.title.trim(),
            mood: entry.mood.trim(),
            text: entry.text.trim(),
            userUid: user.uid,
            tracks: entry.tracks,
          });

          setEntry({
            date: '',
            title: '',
            mood: '',
            text: '',
            tracks: [{ artist: '', trackTitle: '' }]
          });

          console.log('Entry successfully saved to Firestore!');
          router.push('/viewEntry');
        } catch (error) {
          console.error('Error adding entry:', error);
          window.alert(`Error adding entry: ${error.message}`);
        }
      } else {
        window.alert('Please fill in all track details');
      }
    } else {
      window.alert('Please fill in all fields');
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.pagecontentContainer}>
        <div className={styles.titleContainer}>
          <Image
            src="/createentry/createentry-title.png"
            className={styles.titleImage}
            width={1188}
            height={211}
            alt="Entry Title"
          />
        </div>
        <div className={styles.createentryContainer}>
          <form onSubmit={addEntry}>
            <div className={styles.flexContainer}>
              <div className={styles.imageContainer}>
                <Image
                  src="/createentry/createentryimg-plc.png"
                  className={styles.image}
                  width={544}
                  height={809}
                  alt="Entry Placeholder"
                />
              </div>
              <div className={styles.formContainer}>  
                  <div className={styles.headingsContainer}>
                    <Image src={CeIcon} className={styles.icon} />
                    <h1 className={styles.headings}>Title</h1>
                  </div>
                  <input
                    placeholder="Title"
                    type="text"
                    name="title"
                    value={entry.title}
                    onChange={handleInput}
                    className={styles.input}
                  />
                  <div className={styles.headingsContainer}>
                    <Image src={CeIcon} className={styles.icon} />
                    <h1 className={styles.headings}>Mood</h1>
                  </div>
                  <select name="mood" value={entry.mood} onChange={handleMoodSelect} className={styles.select}>
                    <option value="">I'm feeling very...</option>
                    <option value="Happy">Happy</option>
                    <option value="Sad">Sad</option>
                    <option value="Angry">Angry</option>
                    <option value="Scared">Scared</option>
                    <option value="Disgusted">Disgusted</option>
                  </select>
                  <div className={styles.headingsContainer}>
                    <Image src={CeIcon} className={styles.icon} />
                    <h1 className={styles.headings}>Date</h1>
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={entry.date}
                    onChange={handleInput}
                    className={styles.input}
                  />
              </div>
            </div>
            <div className={styles.flexContainer2}>
              <div className={styles.headingsContainer}>
                <h1 className={styles.headings}>My day went...</h1>
              </div>
              <div className={styles.textContainer}>
                <textarea
                  name="text"
                  value={entry.text}
                  onChange={handleInput}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.flexContainer3}>
              <div className={styles.trackDescription}>
                <div className={styles.headingsContainer}>
                  <h1 className={styles.headings}>Songs I was listening to...</h1>
                </div>
                <h2 className={styles.headings2}> Put down what your top tracks of the day were! Please make sure everything is spelt 
                  correctly
                </h2>
              </div>
              <div className={styles.tracksContainer}>
                {entry.tracks.map((track, index) => (
                  <div key={index} className={styles.trackInput}>
                    <h1 className={styles.headings3}>Track {index + 1}</h1>
                    <input
                      placeholder="Artist"
                      type="text"
                      value={track.artist}
                      onChange={(e) => handleTrackInput(index, 'artist', e.target.value)}
                      className={styles.input}
                    />
                    <input
                      placeholder="Track Title"
                      type="text"
                      value={track.trackTitle}
                      onChange={(e) => handleTrackInput(index, 'trackTitle', e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      className={styles.button}
                    >
                      Remove Track
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTrack}
                  className={styles.button}
                  disabled={entry.tracks.length >= 5}  
                  style={{
                    backgroundColor: entry.tracks.length >= 5 ? '#5a3f6e' : '',  
                  }}
                >
                  {entry.tracks.length >= 5 ? 'Track limit reached' : 'Add Track'}
                </button>
              </div>


            </div>
            <div className={styles.flexContainer4}>
              <button type="submit" className={styles.buttonsubmit}>
                Save Entry
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default NewEntry;
