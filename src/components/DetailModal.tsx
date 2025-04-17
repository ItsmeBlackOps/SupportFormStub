import React from 'react';
import { Modal } from './Modal';
import { Calendar, Clock, Building2, User2, Mail, Phone } from 'lucide-react';
import { Candidate } from '../types';

interface DetailModalProps {
  candidate: Candidate | null;
  title: string;
  onClose: () => void;
  formatDateTime: (dateTime?: string) => string;
}

export function DetailModal({ candidate, title, onClose, formatDateTime }: DetailModalProps) {
  if (!candidate) return null;

  // Build rows dynamically based on taskType
  const rows: { label: string; value: string }[] = [
    { label: 'Name', value: candidate.name },
    { label: 'Gender', value: candidate.gender },
    { label: 'Technology', value: candidate.technology },
    { label: 'End Client', value: candidate.endClient },
  ];

  if (candidate.taskType === 'interview') {
    rows.push(
      { label: 'Job Title', value: candidate.jobTitle || '' },
      { label: 'Interview Round', value: candidate.interviewRound || '' },
      { label: 'Interview Date & Time', value: formatDateTime(candidate.interviewDateTime) }
    );
  } else {
    rows.push(
      { label: 'Assessment Deadline', value: formatDateTime(candidate.assessmentDeadline) }
    );
  }

  rows.push(
    { label: 'Duration', value: `${candidate.duration} minutes` },
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
            {/* label cell: no padding, no extra line-height */}
            <td className="border border-black p-1 leading-none font-semibold">
              {label}
            </td>

            {/* value cell: no padding, no extra line-height */}
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
