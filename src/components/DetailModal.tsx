import React from 'react';
import { Modal } from './Modal';
import { Calendar, Clock, Briefcase, Building2, User2, Mail, Phone, Code, Target } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  gender: string;
  technology: string;
  endClient: string;
  interviewRound: string;
  jobTitle: string;
  email: string;
  phone: string;
  interviewDateTime: string;
  duration: string;
}

interface DetailModalProps {
  candidate: Candidate | null;
  title: string;
  onClose: () => void;
  formatDateTime: (dateTime: string) => string;
}

export function DetailModal({ candidate, title, onClose, formatDateTime }: DetailModalProps) {
  if (!candidate) return null;

  // **Define your rows here** using the fields from `candidate`
  const rows = [
    { label: 'Name',             value: candidate.name },
    { label: 'Gender',           value: candidate.gender },
    { label: 'Technology',       value: candidate.technology },
    { label: 'End Client',       value: candidate.endClient },
    { label: 'Interview Round',  value: candidate.interviewRound },
    { label: 'Job Title',        value: candidate.jobTitle },
    { label: 'Email',            value: candidate.email },
    { label: 'Phone',            value: candidate.phone },
    {
      label: 'Interview Date/Time',
      value: formatDateTime(candidate.interviewDateTime),
    },
    { label: 'Duration',         value: candidate.duration },
  ];

  return (
    <Modal isOpen onClose={onClose} title={title}>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-black text-black">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label}>
                <td className="border border-black px-4 py-2 font-semibold">
                  {label}
                </td>
                <td className="border border-black px-4 py-2">
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