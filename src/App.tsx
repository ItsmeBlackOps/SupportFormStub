// src/App.tsx
import React, { useState, useEffect } from 'react';
import { UserRound, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CandidateForm } from './components/CandidateForm';
import { CandidateList } from './components/CandidateList';
import { DetailModal } from './components/DetailModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Tabs } from './components/Tabs';
import type { FormData, Candidate } from './types';

interface AutocompleteData {
  names: Set<string>;
  genders: Set<string>;
  technologies: Set<string>;
  emails: Set<string>;
  phones: Set<string>;
}

interface ImageAnalysisError {
  message: string;
  timestamp: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'scheduled'>('new');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [autocompleteData, setAutocompleteData] = useState<AutocompleteData>({
    names: new Set(),
    genders: new Set(),
    technologies: new Set(),
    emails: new Set(),
    phones: new Set(),
  });

  const [formData, setFormData] = useState<FormData>({
    taskType: 'interview',
    name: '',
    gender: '',
    technology: '',
    endClient: '',
    email: '',
    phone: '',
    // optional fields
    jobTitle: '',
    interviewRound: '',
    interviewDateTime: '',
    assessmentDeadline: '',
    availabilityDateTime: '',
    mockMode: undefined,
    remarks: '',
    duration: '60',
  });

  const [submittedData, setSubmittedData] = useState<Candidate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<ImageAnalysisError | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('candidates');
    if (saved) {
      const parsed: Candidate[] = JSON.parse(saved);
      setCandidates(parsed);
      // build autocomplete sets
      const auto: AutocompleteData = {
        names: new Set(),
        genders: new Set(),
        technologies: new Set(),
        emails: new Set(),
        phones: new Set(),
      };
      parsed.forEach(c => {
        auto.names.add(c.name);
        auto.genders.add(c.gender);
        auto.technologies.add(c.technology);
        auto.emails.add(c.email);
        auto.phones.add(c.phone);
      });
      setAutocompleteData(auto);
    }
  }, []);

  // Handle image paste autofill
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          setIsAnalyzing(true);
          setAnalysisError(null);
          const blob = item.getAsFile();
          if (!blob) break;
          try {
            const data = new FormData();
            data.append('file', blob);
            const res = await fetch('https://blackops.tunn.dev/parse-candidate/', {
              method: 'POST',
              body: data
            });
            if (!res.ok) throw new Error(res.statusText);
            const json = await res.json();
            setFormData(prev => ({
              ...prev,
              name: json.candidate_name || prev.name,
              gender: json.gender || prev.gender,
              technology: json.technology || prev.technology,
              email: json.email || prev.email,
              phone: json.contact_number || prev.phone,
            }));
          } catch (err) {
            setAnalysisError({
              message: err instanceof Error ? err.message : String(err),
              timestamp: Date.now()
            });
          } finally {
            setIsAnalyzing(false);
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCand: Candidate = {
      id: editingCandidate?.id || crypto.randomUUID(),
      ...formData
    };
    const updated = editingCandidate
      ? candidates.map(c => c.id === editingCandidate.id ? newCand : c)
      : [...candidates, newCand];
    setCandidates(updated);
    localStorage.setItem('candidates', JSON.stringify(updated));

    // update autocomplete
    setAutocompleteData(prev => ({
      names: new Set(prev.names).add(newCand.name),
      genders: new Set(prev.genders).add(newCand.gender),
      technologies: new Set(prev.technologies).add(newCand.technology),
      emails: new Set(prev.emails).add(newCand.email),
      phones: new Set(prev.phones).add(newCand.phone),
    }));

    setSubmittedData(newCand);
    setShowModal(true);
    setEditingCandidate(null);
    setActiveTab('scheduled');
    setFormData({
      taskType: newCand.taskType,
      name: '',
      gender: '',
      technology: '',
      endClient: '',
      email: '',
      phone: '',
      jobTitle: '',
      interviewRound: '',
      interviewDateTime: '',
      assessmentDeadline: '',
      availabilityDateTime: '',
      mockMode: undefined,
      remarks: '',
      duration: '60',
    });
  };

  const handleDelete = (id: string) => {
    const updated = candidates.filter(c => c.id !== id);
    setCandidates(updated);
    localStorage.setItem('candidates', JSON.stringify(updated));
    // rebuild autocomplete
    const auto: AutocompleteData = {
      names: new Set(),
      genders: new Set(),
      technologies: new Set(),
      emails: new Set(),
      phones: new Set(),
    };
    updated.forEach(c => {
      auto.names.add(c.name);
      auto.genders.add(c.gender);
      auto.technologies.add(c.technology);
      auto.emails.add(c.email);
      auto.phones.add(c.phone);
    });
    setAutocompleteData(auto);
    setShowActionMenu(null);
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    const { id, ...rest } = candidate;
    setFormData(rest);
    setShowActionMenu(null);
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Formatting helpers
  const formatDateTime = (dt?: string) => dt
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'short', year: 'numeric', month: 'short',
        day: 'numeric', hour: 'numeric', minute: '2-digit',
        timeZone: 'America/New_York', hour12: true
      }).format(new Date(dt)) + ' (EDT)'
    : '';

  const formatDate = (d?: string) => d
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        timeZone: 'America/New_York'
      }).format(new Date(d))
    : '';

  // Modal title builder per taskType
  const getModalTitle = (c: Candidate) => {
    switch (c.taskType) {
      case 'interview':
        return `Interview Support — ${c.name} — ${c.jobTitle} — ${formatDateTime(c.interviewDateTime)}`;
      case 'assessment':
        return `Assessment Support — ${c.name} — Due ${formatDate(c.assessmentDeadline)}`;
      case 'mock':
        return `Mock Interview — ${c.name} — ${formatDateTime(c.availabilityDateTime)}`;
      case 'resumeUnderstanding':
        return `Resume Understanding — ${c.name} — ${formatDateTime(c.availabilityDateTime)}`;
      case 'resumeReview':
        return `Resume Review — ${c.name}`;
      default:
        return c.name;
    }
  };

  const tabs = [
    {
      id: 'new', label: 'New', icon: Plus, content: (
        <>
          {isAnalyzing && <LoadingOverlay isVisible={isAnalyzing} />}
          {analysisError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{analysisError.message}</p>
            </div>
          )}
          <CandidateForm
            formData={formData}
            setFormData={setFormData}
            autocompleteData={autocompleteData}
            onSubmit={handleSubmit}
            isEditing={!!editingCandidate}
          />
        </>
      )
    },
    {
      id: 'scheduled', label: 'Scheduled', icon: CalendarIcon, content: (
        <CandidateList
          candidates={candidates}
          onView={setViewingCandidate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActionMenu={showActionMenu}
          setShowActionMenu={setShowActionMenu}
          formatDateTime={formatDateTime}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <UserRound className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">Support Manager</h1>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={tab => setActiveTab(tab as 'new' | 'scheduled')}
        />

        {showModal && submittedData && (
          <DetailModal
            candidate={submittedData}
            title={getModalTitle(submittedData)}
            onClose={() => setShowModal(false)}
            formatDateTime={dt =>
              submittedData.taskType === 'assessment'
                ? formatDate(dt)
                : formatDateTime(dt)
            }
          />
        )}

        {viewingCandidate && (
          <DetailModal
            candidate={viewingCandidate}
            title={getModalTitle(viewingCandidate)}
            onClose={() => setViewingCandidate(null)}
            formatDateTime={dt =>
              viewingCandidate.taskType === 'assessment'
                ? formatDate(dt)
                : formatDateTime(dt)
            }
          />
        )}
      </div>
    </div>
  );
}
