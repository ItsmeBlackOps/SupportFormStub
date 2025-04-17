// src/components/CandidateForm.tsx
import React from 'react';
import { Save } from 'lucide-react';
import { AutocompleteInput } from './AutocompleteInput';
import { FormData, TaskType } from '../types';

interface AutocompleteData {
  names: Set<string>;
  genders: Set<string>;
  technologies: Set<string>;
  emails: Set<string>;
  phones: Set<string>;
}

interface CandidateFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  autocompleteData: AutocompleteData;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export function CandidateForm({
  formData,
  setFormData,
  autocompleteData,
  onSubmit,
  isEditing
}: CandidateFormProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Task Type */}
        <div>
          <label htmlFor="taskType" className="block text-sm font-medium text-gray-700">
            Task Type
          </label>
          <select
            id="taskType"
            value={formData.taskType}
            onChange={(e) => setFormData({ ...formData, taskType: e.target.value as TaskType })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="interview">Interview Support</option>
            <option value="assessment">Assessment Support</option>
          </select>
        </div>

        {/* Shared Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AutocompleteInput
            id="name"
            label="Candidate Name"
            value={formData.name}
            options={[...autocompleteData.names]}
            onChange={(value) => setFormData({ ...formData, name: value })}
            onOptionSelect={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender}
              required
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <AutocompleteInput
            id="technology"
            label="Technology"
            value={formData.technology}
            options={[...autocompleteData.technologies]}
            onChange={(value) => setFormData({ ...formData, technology: value })}
            onOptionSelect={(value) => setFormData({ ...formData, technology: value })}
            required
          />

          <div>
            <label htmlFor="endClient" className="block text-sm font-medium text-gray-700">
              End Client
            </label>
            <input
              type="text"
              id="endClient"
              value={formData.endClient}
              required
              onChange={(e) => setFormData({ ...formData, endClient: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <AutocompleteInput
            id="email"
            label="Email ID"
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            value={formData.email}
            options={[...autocompleteData.emails]}
            onChange={(value) => setFormData({ ...formData, email: value })}
            onOptionSelect={(value) => setFormData({ ...formData, email: value })}
            required
          />

          <AutocompleteInput
            id="phone"
            label="Contact Number"
            type="tel"
            pattern="[0-9\s-()]+"
            value={formData.phone}
            options={[...autocompleteData.phones]}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            onOptionSelect={(value) => setFormData({ ...formData, phone: value })}
            required
          />

          {/* Interview-only Fields */}
          {formData.taskType === 'interview' && (
            <>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  value={formData.jobTitle || ''}
                  required
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="interviewRound" className="block text-sm font-medium text-gray-700">
                  Interview Round
                </label>
                <select
                  id="interviewRound"
                  value={formData.interviewRound || ''}
                  required
                  onChange={(e) => setFormData({ ...formData, interviewRound: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select Round</option>
                  <option value="Screening">Screening</option>
                  <option value="1st">1st Round</option>
                  <option value="2nd">2nd Round</option>
                  <option value="3rd">3rd Round</option>
                  <option value="Final">Final Round</option>
                </select>
              </div>

              <div>
                <label htmlFor="interviewDateTime" className="block text-sm font-medium text-gray-700">
                  Interview Date & Time (EDT)
                </label>
                <input
                  type="datetime-local"
                  id="interviewDateTime"
                  value={formData.interviewDateTime || ''}
                  required
                  onChange={(e) => setFormData({ ...formData, interviewDateTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          {/* Assessment-only Field */}
          {formData.taskType === 'assessment' && (
            <div>
              <label htmlFor="assessmentDeadline" className="block text-sm font-medium text-gray-700">
                Assessment Deadline
              </label>
              <input
                type="date"
                id="assessmentDeadline"
                value={formData.assessmentDeadline || ''}
                required
                onChange={(e) => setFormData({ ...formData, assessmentDeadline: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={formData.duration}
              required
              min={15}
              max={180}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" />
          {isEditing ? 'Update Details' : 'Save Details'}
        </button>
      </form>
    </div>
  );
}
