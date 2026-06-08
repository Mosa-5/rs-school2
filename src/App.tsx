import { useState } from 'react';
import { useAppSelector } from './store/hooks';
import Modal from './components/Modal/Modal';
import UncontrolledForm from './components/forms/UncontrolledForm/UncontrolledForm';
import RhfForm from './components/forms/RhfForm/RhfForm';
import SubmissionCard from './components/SubmissionCard/SubmissionCard';
import styles from './App.module.css';

type OpenForm = 'uncontrolled' | 'rhf' | null;

const HIGHLIGHT_DURATION_MS = 3000;

function App() {
  const submissions = useAppSelector((state) => state.submissions.items);
  const [openForm, setOpenForm] = useState<OpenForm>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleSuccess = (submissionId: string) => {
    setOpenForm(null);
    setHighlightedId(submissionId);
    window.setTimeout(() => {
      setHighlightedId((current) =>
        current === submissionId ? null : current
      );
    }, HIGHLIGHT_DURATION_MS);
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>React Forms</h1>

      <div className={styles.actions}>
        <button type="button" onClick={() => setOpenForm('uncontrolled')}>
          Open uncontrolled form
        </button>
        <button type="button" onClick={() => setOpenForm('rhf')}>
          Open React Hook Form
        </button>
      </div>

      <section className={styles.results} aria-label="Submissions">
        <h2 className={styles.subtitle}>Submissions</h2>
        {submissions.length === 0 ? (
          <p className={styles.empty}>No submissions yet.</p>
        ) : (
          <div className={styles.grid}>
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isNew={submission.id === highlightedId}
              />
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={openForm === 'uncontrolled'}
        onClose={() => setOpenForm(null)}
        title="Uncontrolled form"
      >
        <UncontrolledForm onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={openForm === 'rhf'}
        onClose={() => setOpenForm(null)}
        title="React Hook Form"
      >
        <RhfForm onSuccess={handleSuccess} />
      </Modal>
    </main>
  );
}

export default App;
