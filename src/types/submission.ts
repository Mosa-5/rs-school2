export interface Submission {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  acceptTerms: boolean;
  image: string;
  createdAt: number;
}

export type SubmissionInput = Omit<Submission, 'id' | 'createdAt'>;
