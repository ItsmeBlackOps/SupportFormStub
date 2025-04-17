import React from 'react';
import { Eye, Edit2, Trash2, MoreVertical, Calendar, Clock, Building2 } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateListProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  showActionMenu: string | null;
  setShowActionMenu: (id: string | null) => void;
  formatDateTime: (dateTime?: string) => string;
}

export function CandidateList({
  candidates,
  onView,
  onEdit,
  onDelete,
  showActionMenu,
  setShowActionMenu,
  formatDateTime,
}: CandidateListProps) {
  if (candidates.length === 0) return null;

  // Determine task type from first candidate
  const isAssessment = candidates[0].taskType === 'assessment';

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {isAssessment ? 'Scheduled Assessments' : 'Scheduled Interviews'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {candidates.length} {isAssessment
            ? (candidates.length === 1 ? 'assessment' : 'assessments')
            : (candidates.length === 1 ? 'interview' : 'interviews')} scheduled
        </p>
      </div>

      {/* List Items */}
      <div className="divide-y divide-gray-200">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="p-6 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                {/* Candidate Info */}
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {candidate.taskType === 'interview'
                        ? `${candidate.interviewRound} Round`
                        : `Due ${candidate.assessmentDeadline}`}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {candidate.taskType === 'interview'
                      ? `${candidate.jobTitle} • ${candidate.technology}`
                      : candidate.technology}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDateTime(
                        candidate.taskType === 'interview'
                          ? candidate.interviewDateTime
                          : candidate.assessmentDeadline
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{candidate.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{candidate.endClient}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-sm text-gray-500">
                  {candidate.email} • {candidate.phone}
                </div>
              </div>

              {/* Action Menu */}
              <div className="relative ml-4">
                <button
                  onClick={() => setShowActionMenu(showActionMenu === candidate.id ? null : candidate.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
                {showActionMenu === candidate.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => onView(candidate)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </button>
                      <button
                        onClick={() => onEdit(candidate)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(candidate.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
