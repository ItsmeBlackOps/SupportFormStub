export type TaskType =
  | 'interview'
  | 'assessment'
  | 'mock'             // ← new
  | 'understanding'   // ← new
  | 'review';         // ← new

/**
 * FormData represents the fields captured by the CandidateForm.
 * Fields marked optional (?) are only required for one of the two task types.
 */
export interface FormData {
  taskType: TaskType;
  name: string;
  gender: string;
  technology: string;
  endClient: string;
  interviewRound?: string;     // only for interviews
  jobTitle?: string;           // only for interviews
  email: string;
  phone: string;
  interviewDateTime?: string;  // only for interviews
  duration: string;
  assessmentDeadline?: string; // only for assessments
  availabilityDateTime?: string;  // ← new
  remarks?: string;               // ← new
  mockMode?: 'Evaluation' | 'Training'; // ← new dropdown
  understandingAvailability?: string;
}

/**
 * Candidate extends FormData with a unique identifier.
 */
export interface Candidate extends FormData {
  id: string;
  duration?: string;
}
