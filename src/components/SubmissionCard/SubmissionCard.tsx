import type { Submission } from '../../types/submission';
import styles from './SubmissionCard.module.css';

interface SubmissionCardProps {
  submission: Submission;
  isNew: boolean;
}

function SubmissionCard({ submission, isNew }: SubmissionCardProps) {
  return (
    <article
      className={isNew ? `${styles.card} ${styles.new}` : styles.card}
      data-testid="submission-card"
    >
      <img
        className={styles.image}
        src={submission.image}
        alt={`${submission.name} profile`}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{submission.name}</h3>
        <dl className={styles.details}>
          <div>
            <dt>Age</dt>
            <dd>{submission.age}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{submission.email}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{submission.gender}</dd>
          </div>
          <div>
            <dt>Country</dt>
            <dd>{submission.country}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default SubmissionCard;
