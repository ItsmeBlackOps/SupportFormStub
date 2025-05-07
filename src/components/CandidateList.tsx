// src/components/CandidateList.tsx
import React from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Building2,
  FileText
} from 'lucide-react';
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

  const type = candidates[0].taskType;
  const headerMap: Record<string, string> = {
    interview: 'Scheduled Interviews',
    assessment: 'Scheduled Assessments',
    mock: 'Scheduled Mock Interviews',
    resumeUnderstanding: 'Scheduled Resume Understandings',
    resumeReview: 'Scheduled Resume Reviews',
  };
  const nounMap: Record<string, [string, string]> = {
    interview: ['interview', 'interviews'],
    assessment: ['assessment', 'assessments'],
    mock: ['mock interview', 'mock interviews'],
    resumeUnderstanding: ['resume understanding', 'resume understandings'],
    resumeReview: ['resume review', 'resume reviews'],
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {headerMap[type]}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {candidates.length}{' '}
          {candidates.length === 1
            ? nounMap[type][0]
            : nounMap[type][1]}{' '}
          scheduled
        </p>
      </div>

      {/* List Items */}
      <div className="divide-y divide-gray-200">
        {candidates.map((c) => {
          const badgeText = {
            interview: `${c.interviewRound} Round`,
            assessment: `Due ${c.assessmentDeadline}`,
            mock: c.mockMode || '',
            resumeUnderstanding: `Avail ${formatDateTime(c.availabilityDateTime)}`,
            resumeReview: 'Resume Review',
          }[c.taskType];

          const subtitle = c.taskType === 'interview'
            ? `${c.jobTitle} • ${c.technology}`
            : c.technology;

          return (
            <div
              key={c.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  {/* Name & Badge */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {c.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {badgeText}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {subtitle}
                    </p>
                  </div>

                  {/* Details (vary by type) */}
                  {['interview', 'assessment'].includes(c.taskType) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDateTime(
                            c.taskType === 'interview'
                              ? c.interviewDateTime
                              : c.assessmentDeadline
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {c.duration} minutes
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {c.endClient}
                        </span>
                      </div>
                    </div>
                  )}

                  {c.taskType === 'mock' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDateTime(c.availabilityDateTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {c.endClient}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {c.remarks}
                        </span>
                      </div>
                    </div>
                  )}

                  {c.taskType === 'resumeUnderstanding' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDateTime(c.availabilityDateTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {c.remarks}
                        </span>
                      </div>
                    </div>
                  )}

                  {c.taskType === 'resumeReview' && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {c.remarks}
                      </span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="text-sm text-gray-500">
                    {c.email} • {c.phone}
                  </div>
                </div>

                {/* Action Menu */}
                <div className="relative ml-4">
                  <button
                    onClick={() =>
                      setShowActionMenu(
                        showActionMenu === c.id ? null : c.id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  {showActionMenu === c.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu">
                        <button
                          onClick={() => onView(c)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </button>
                        <button
                          onClick={() => onEdit(c)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
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
          );
        })}
      </div>
    </div>
  );
}
