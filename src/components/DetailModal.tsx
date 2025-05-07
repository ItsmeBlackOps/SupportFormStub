// src/components/DetailModal.tsx
import React from 'react';
import { Modal } from './Modal';
import { Candidate } from '../types';

interface DetailModalProps {
  candidate: Candidate | null;
  title: string;
  onClose: () => void;
  formatDateTime: (dateTime?: string) => string;
}

export function DetailModal({
  candidate,
  title,
  onClose,
  formatDateTime,
}: DetailModalProps) {
  if (!candidate) return null;

  const rows: { label: string; value: string }[] = [
    { label: 'Name', value: candidate.name },
    { label: 'Gender', value: candidate.gender },
    { label: 'Technology', value: candidate.technology },
  ];

  // Only Interview & Assessment have End Client
  if (['interview', 'assessment'].includes(candidate.taskType)) {
    rows.push({ label: 'End Client', value: candidate.endClient });
  }

  switch (candidate.taskType) {
    case 'interview':
      rows.push(
        { label: 'Job Title', value: candidate.jobTitle || '' },
        { label: 'Interview Round', value: candidate.interviewRound || '' },
        {
          label: 'Interview Date & Time',
          value: formatDateTime(candidate.interviewDateTime),
        },
        { label: 'Duration', value: `${candidate.duration} minutes` }
      );
      break;
    case 'assessment':
      rows.push(
        {
          label: 'Assessment Deadline',
          value: formatDateTime(candidate.assessmentDeadline),
        },
        { label: 'Duration', value: `${candidate.duration} minutes` }
      );
      break;
    case 'mock':
      rows.push(
        {
          label: 'Availability',
          value: formatDateTime(candidate.availabilityDateTime),
        },
        { label: 'Remarks', value: candidate.remarks || '' }
      );
      break;
    case 'resumeUnderstanding':
      rows.push(
        {
          label: 'Availability',
          value: formatDateTime(candidate.availabilityDateTime),
        },
        { label: 'Remarks', value: candidate.remarks || '' }
      );
      break;
    case 'resumeReview':
      rows.push({ label: 'Remarks', value: candidate.remarks || '' });
      break;
  }

  // Always show contact info
  rows.push(
    { label: 'Email', value: candidate.email },
    { label: 'Phone', value: candidate.phone }
  );

  return (
    <Modal isOpen onClose={onClose} title={title}>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-black text-black border-spacing-0">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b">
                <td className="border border-black p-1 leading-none font-semibold">
                  {label}
                </td>
                <td className="border border-black p-1 leading-none w-auto">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
