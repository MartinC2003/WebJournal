import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '../styles/viewentry.module.css';

function ViewEntry({entries }) {
  const router = useRouter();

  const handleViewMore = (id) => {
    router.push(`/viewEntry/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1];

    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  return (
    <div className={styles.entriesContainer}>
      {entries.length > 0 ? (
        entries.map((entry) => (
          <div key={entry.id} className={styles.entryCard}>
            <div className={styles.entrycardContent}>
              <Image
                src="/viewentry/viewentryimg-plc.png"
                className={styles.entryImage}
                width={200}
                height={411}
                alt="Entry Title"
              />
              <div className={styles.entrycardContent2}>
                <div className={styles.entrycardContentDate}>
                  <Image
                    src="/icons/VeIcon.svg"
                    className={styles.entryImage}
                    width={20}
                    height={20}
                    alt="Entry Title"
                  />
                  <p className={styles.entryDate}>{formatDate(entry.date)}</p>
                  <Image
                    src="/icons/VeIcon.svg"
                    className={styles.entryImage}
                    width={20}
                    height={20}
                    alt="Entry Title"
                  />
                </div>
                <h2 className={styles.entryName}>{entry.title}</h2>
              </div>
              <div className={styles.entrycardContent3}>
                <button
                  onClick={() => handleViewMore(entry.id)}
                  className={styles.button}
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noEntriesContainer}>
          <h1 className={styles.headings}>
            No entries found
          </h1>
        </div>
      )}
    </div>
  );
}

export default ViewEntry;
