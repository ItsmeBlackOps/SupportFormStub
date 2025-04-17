import React, { useState, useEffect } from 'react';
import { UserRound, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { InterviewForm } from './components/InterviewForm';
import { CandidateList } from './components/CandidateList';
import { DetailModal } from './components/DetailModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Tabs } from './components/Tabs';

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

function App() {
  const [activeTab, setActiveTab] = useState('new');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [autocompleteData, setAutocompleteData] = useState<AutocompleteData>({
    names: new Set(),
    genders: new Set(),
    technologies: new Set(),
    emails: new Set(),
    phones: new Set(),
  });
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    technology: '',
    endClient: '',
    interviewRound: '',
    jobTitle: '',
    email: '',
    phone: '',
    interviewDateTime: '',
    duration: '60',
  });
  const [submittedData, setSubmittedData] = useState<Candidate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<ImageAnalysisError | null>(null);

  useEffect(() => {
    const savedCandidates = localStorage.getItem('candidates');
    if (savedCandidates) {
      const parsedCandidates = JSON.parse(savedCandidates);
      setCandidates(parsedCandidates);
      
      const newAutocompleteData = parsedCandidates.reduce((acc: AutocompleteData, candidate: Candidate) => {
        acc.names.add(candidate.name);
        acc.genders.add(candidate.gender);
        acc.technologies.add(candidate.technology);
        acc.emails.add(candidate.email);
        acc.phones.add(candidate.phone);
        return acc;
      }, {
        names: new Set<string>(),
        genders: new Set<string>(),
        technologies: new Set<string>(),
        emails: new Set<string>(),
        phones: new Set<string>(),
      });
      
      setAutocompleteData(newAutocompleteData);
    }
  }, []);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();

          const blob = item.getAsFile();
          if (!blob) continue;

          setIsAnalyzing(true);
          setAnalysisError(null);

          try {
            const formData = new FormData();
            formData.append('file', blob, 'pasted-image.png');

            const res = await fetch('https://blackops.tunn.dev/parse-candidate/', {
              method: 'POST',
              body: formData,
              mode: "cors"
            });

            if (!res.ok) {
              throw new Error(`Analysis failed: ${res.statusText}`);
            }

            const data = await res.json();
            
            setFormData(prev => ({
              ...prev,
              name: data.candidate_name || prev.name,
              gender: data.gender || prev.gender,
              technology: data.technology || prev.technology,
              email: data.email || prev.email,
              phone: data.contact_number || prev.phone,
            }));
          } catch (err) {
            setAnalysisError({
              message: err instanceof Error ? err.message : 'Failed to analyze image',
              timestamp: Date.now(),
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
    const newCandidate: Candidate = {
      id: editingCandidate?.id || crypto.randomUUID(),
      ...formData,
    };
    
    let updatedCandidates;
    if (editingCandidate) {
      updatedCandidates = candidates.map(c => 
        c.id === editingCandidate.id ? newCandidate : c
      );
    } else {
      updatedCandidates = [...candidates, newCandidate];
    }
    
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    
    setAutocompleteData(prev => ({
      names: new Set(prev.names).add(newCandidate.name),
      genders: new Set(prev.genders).add(newCandidate.gender),
      technologies: new Set(prev.technologies).add(newCandidate.technology),
      emails: new Set(prev.emails).add(newCandidate.email),
      phones: new Set(prev.phones).add(newCandidate.phone),
    }));
    
    setSubmittedData(newCandidate);
    setShowModal(true);
    setEditingCandidate(null);
    setActiveTab('scheduled');
    
    setFormData({
      name: '',
      gender: '',
      technology: '',
      endClient: '',
      interviewRound: '',
      jobTitle: '',
      email: '',
      phone: '',
      interviewDateTime: '',
      duration: '60',
    });
  };

  const handleDelete = (id: string) => {
    const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    
    const newAutocompleteData = updatedCandidates.reduce((acc: AutocompleteData, candidate: Candidate) => {
      acc.names.add(candidate.name);
      acc.genders.add(candidate.gender);
      acc.technologies.add(candidate.technology);
      acc.emails.add(candidate.email);
      acc.phones.add(candidate.phone);
      return acc;
    }, {
      names: new Set<string>(),
      genders: new Set<string>(),
      technologies: new Set<string>(),
      emails: new Set<string>(),
      phones: new Set<string>(),
    });
    
    setAutocompleteData(newAutocompleteData);
    setShowActionMenu(null);
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      gender: candidate.gender,
      technology: candidate.technology,
      endClient: candidate.endClient,
      interviewRound: candidate.interviewRound,
      jobTitle: candidate.jobTitle,
      email: candidate.email,
      phone: candidate.phone,
      interviewDateTime: candidate.interviewDateTime,
      duration: candidate.duration,
    });
    setShowActionMenu(null);
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
      hour12: true,
    }).format(date) + ' (EDT)';
  };

  const tabs = [
    {
      id: 'new',
      label: 'New Interview',
      icon: Plus,
      content: (
        <>
          {isAnalyzing && <LoadingOverlay isVisible={isAnalyzing} />}

          {analysisError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{analysisError.message}</p>
            </div>
          )}

          <InterviewForm
            formData={formData}
            setFormData={setFormData}
            autocompleteData={autocompleteData}
            onSubmit={handleSubmit}
            isEditing={!!editingCandidate}
          />
        </>
      ),
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      icon: CalendarIcon,
      content: (
        <CandidateList
          candidates={candidates}
          onView={setViewingCandidate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActionMenu={showActionMenu}
          setShowActionMenu={setShowActionMenu}
          formatDateTime={formatDateTime}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserRound className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">Interview Manager</h1>
            </div>
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {showModal && submittedData && (
  <DetailModal
    candidate={submittedData}
    title={`Interview Support - ${submittedData.name} - ${submittedData.jobTitle} - ${formatDateTime(submittedData.interviewDateTime)}`}
    onClose={() => setShowModal(false)}
    formatDateTime={formatDateTime}
  />
)}

          
{viewingCandidate && (
  <DetailModal
    candidate={viewingCandidate}
    title={`Interview Support - ${viewingCandidate.name} - ${viewingCandidate.jobTitle} - ${formatDateTime(viewingCandidate.interviewDateTime)}`}
    onClose={() => setViewingCandidate(null)}
    formatDateTime={formatDateTime}
  />
)}

        </div>
      </div>
    </div>
  );
}

export default App;