import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Download,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Question, Branch, QuestionType, Difficulty } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { questions, addQuestion, deleteQuestion, bulkImportQuestions } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'bulk' | 'list'>('create');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // New question form state
  const [exam, setExam] = useState('GATE');
  const [branch, setBranch] = useState<Branch>('CSE/IT');
  const [year, setYear] = useState<number>(2024);
  const [subject, setSubject] = useState('Operating Systems');
  const [topic, setTopic] = useState('Process Scheduling');
  const [qNumber, setQNumber] = useState(1);
  const [marks, setMarks] = useState<1 | 2>(2);
  const [qType, setQType] = useState<QuestionType>('MCQ');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('B');
  const [explanationStep, setExplanationStep] = useState('');
  const [conceptTested, setConceptTested] = useState('');
  const [shortcutTrick, setShortcutTrick] = useState('');

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newId = `GATE-${year}-${branch.split('/')[0]}-${qNumber}`;
    const newQ: Question = {
      id: newId,
      exam,
      branch,
      year,
      subject,
      topic,
      questionNumber: qNumber,
      marks,
      negativeMarks: marks === 1 ? 0.33 : 0.66,
      questionType: qType,
      difficulty,
      questionText: questionText.trim(),
      options: qType !== 'NAT' ? [
        { id: 'A', text: optA || 'Option A' },
        { id: 'B', text: optB || 'Option B' },
        { id: 'C', text: optC || 'Option C' },
        { id: 'D', text: optD || 'Option D' }
      ] : undefined,
      correctAnswer: correctAnswer.trim(),
      explanation: {
        steps: [explanationStep || 'Derive using standard formula.'],
        conceptTested: conceptTested || topic,
        shortcutTrick: shortcutTrick || undefined,
        commonMistake: 'Rushing through calculation.'
      },
      statistics: {
        attemptedCount: 1,
        correctPercent: 100,
        incorrectPercent: 0,
        averageTimeSeconds: 120
      },
      tags: [subject, topic, `GATE ${year}`],
      discussions: []
    };

    addQuestion(newQ);
    alert(`Question ${newId} created successfully!`);
    setQuestionText('');
  };

  const handleBulkImport = () => {
    if (!importText.trim()) return;
    try {
      // Check if JSON
      if (importText.trim().startsWith('[') || importText.trim().startsWith('{')) {
        const parsed = JSON.parse(importText);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const count = bulkImportQuestions(list);
        setImportStatus(`Successfully imported ${count} question(s) via JSON!`);
        setImportText('');
      } else {
        // Fallback simple CSV parsing: id,year,subject,topic,type,marks,answer,text
        const lines = importText.trim().split('\n');
        const imported: Question[] = [];
        lines.forEach((line, idx) => {
          const parts = line.split(',');
          if (parts.length >= 7) {
            imported.push({
              id: parts[0]?.trim() || `GATE-CSV-${idx}`,
              exam: 'GATE',
              branch: 'CSE/IT',
              year: parseInt(parts[1]) || 2024,
              subject: parts[2]?.trim() || 'Computer Science',
              topic: parts[3]?.trim() || 'General',
              questionNumber: idx + 1,
              marks: (parseInt(parts[5]) === 1 ? 1 : 2) as 1 | 2,
              negativeMarks: 0.66,
              questionType: (parts[4]?.trim() || 'MCQ') as QuestionType,
              difficulty: 'Medium',
              questionText: parts.slice(7).join(',').replace(/^"|"$/g, '').trim() || 'Imported Question',
              correctAnswer: parts[6]?.trim() || 'A',
              explanation: {
                steps: ['Standard GATE solution'],
                conceptTested: parts[3]?.trim() || 'Concept',
                commonMistake: 'Calculation error'
              },
              statistics: {
                attemptedCount: 100,
                correctPercent: 70,
                incorrectPercent: 30,
                averageTimeSeconds: 120
              },
              tags: ['CSV Import'],
              discussions: []
            });
          }
        });

        if (imported.length > 0) {
          const count = bulkImportQuestions(imported);
          setImportStatus(`Successfully parsed and imported ${count} question(s) from CSV!`);
          setImportText('');
        } else {
          setImportStatus('Could not parse CSV format. Please review template.');
        }
      }
    } catch (err: any) {
      setImportStatus(`Import Error: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
            Question & Platform Management
          </h1>
          <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
            Create single questions, bulk import JSON/CSV question archives, and manage repository records.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-[#080C0A] rounded-xl border border-[rgba(0,255,136,0.2)] text-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'create' ? 'bg-[#00FF88] text-[#050807] font-bold' : 'text-[#9BA7A1] hover:text-white'
            }`}
          >
            Create Question
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'bulk' ? 'bg-[#00FF88] text-[#050807] font-bold' : 'text-[#9BA7A1] hover:text-white'
            }`}
          >
            Bulk Import
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'list' ? 'bg-[#00FF88] text-[#050807] font-bold' : 'text-[#9BA7A1] hover:text-white'
            }`}
          >
            Manage ({questions.length})
          </button>
        </div>
      </div>

      {/* 1. Create Question Form */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateQuestion} className="nexus-card rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-[#F5F7F6] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#00FF88]" />
            <span>Add Single GATE Question</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as any)}
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
              >
                {['CSE/IT', 'ECE', 'EE', 'ME', 'CE', 'IN', 'DA'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Exam Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Question Number</label>
              <input
                type="number"
                value={qNumber}
                onChange={(e) => setQNumber(parseInt(e.target.value))}
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Type & Marks</label>
              <div className="flex gap-2">
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-1/2 bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="MSQ">MSQ</option>
                  <option value="NAT">NAT</option>
                </select>
                <select
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value) as any)}
                  className="w-1/2 bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
                >
                  <option value={1}>1M</option>
                  <option value={2}>2M</option>
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[#9BA7A1] mb-1 font-mono">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[#9BA7A1] mb-1 font-mono">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-[#9BA7A1] font-mono">Question Statement</label>
            <textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter full GATE problem text here..."
              className="w-full bg-[#050807] border border-white/10 focus:border-[#00FF88] rounded-xl p-3 text-xs text-[#F5F7F6] focus:outline-none font-sans"
            />
          </div>

          {qType !== 'NAT' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Option A"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                className="bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6]"
              />
              <input
                type="text"
                placeholder="Option B"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                className="bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6]"
              />
              <input
                type="text"
                placeholder="Option C"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                className="bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6]"
              />
              <input
                type="text"
                placeholder="Option D"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                className="bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Correct Answer</label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="e.g. B or A,C or 9.25"
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#00FF88] font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Concept Tested</label>
              <input
                type="text"
                value={conceptTested}
                onChange={(e) => setConceptTested(e.target.value)}
                placeholder="Core theorem/principle"
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6]"
              />
            </div>
            <div>
              <label className="block text-[#9BA7A1] mb-1 font-mono">Pro Shortcut (optional)</label>
              <input
                type="text"
                value={shortcutTrick}
                onChange={(e) => setShortcutTrick(e.target.value)}
                placeholder="Speed trick"
                className="w-full bg-[#050807] border border-white/10 rounded-lg p-2 text-[#F5F7F6]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl nexus-glow-btn text-xs font-bold"
            >
              Save Question to Nexus Repository
            </button>
          </div>
        </form>
      )}

      {/* 2. Bulk Import Tab (Section 38) */}
      {activeTab === 'bulk' && (
        <div className="nexus-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#F5F7F6] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#00FF88]" />
              <span>Bulk PYQ Import System</span>
            </h2>
            <p className="text-xs text-[#9BA7A1]">
              Paste JSON or CSV data. All questions will be automatically normalized into the unified database architecture.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9BA7A1]">
              <span>JSON Array or CSV Payload</span>
              <button
                onClick={() => {
                  setImportText(`[
  {
    "id": "GATE-2025-CS-01",
    "exam": "GATE",
    "branch": "CSE/IT",
    "year": 2025,
    "subject": "Algorithms",
    "topic": "Graph Algorithms",
    "questionNumber": 1,
    "marks": 2,
    "negativeMarks": 0.66,
    "questionType": "MCQ",
    "difficulty": "Medium",
    "questionText": "What is the time complexity of Bellman-Ford algorithm for a graph with V vertices and E edges?",
    "options": [
      { "id": "A", "text": "O(V + E)" },
      { "id": "B", "text": "O(V * E)" },
      { "id": "C", "text": "O(V^3)" },
      { "id": "D", "text": "O(E log V)" }
    ],
    "correctAnswer": "B",
    "explanation": {
      "steps": ["Bellman Ford runs |V|-1 relaxations, each iterating over all |E| edges."],
      "conceptTested": "Single source shortest path with negative edges",
      "commonMistake": "Confusing with Dijkstra complexity"
    },
    "statistics": { "attemptedCount": 120, "correctPercent": 85, "incorrectPercent": 15, "averageTimeSeconds": 45 },
    "tags": ["Algorithms", "Graphs", "GATE 2025"],
    "discussions": []
  }
]`);
                }}
                className="text-[#00FF88] hover:underline"
              >
                Insert Sample JSON
              </button>
            </div>

            <textarea
              rows={10}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON array or CSV lines..."
              className="w-full bg-[#050807] border border-[rgba(0,255,136,0.2)] focus:border-[#00FF88] rounded-xl p-3 font-mono text-xs text-[#F5F7F6] focus:outline-none"
            />
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#00FF88]">
              {importStatus}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleBulkImport}
              disabled={!importText.trim()}
              className="px-6 py-2.5 rounded-xl nexus-glow-btn text-xs font-bold disabled:opacity-40"
            >
              Parse & Import Questions
            </button>
          </div>
        </div>
      )}

      {/* 3. Manage Existing Questions List */}
      {activeTab === 'list' && (
        <div className="nexus-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.1)] pb-3">
            <h2 className="text-base font-bold text-[#F5F7F6]">
              All Questions in Active State ({questions.length})
            </h2>
            <span className="text-xs text-[#9BA7A1]">Synced with local persistence</span>
          </div>

          <div className="space-y-2">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-xl bg-[#050807] border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#00FF88] font-bold">{q.id}</span>
                    <span className="text-[#9BA7A1]">·</span>
                    <span className="text-[#F5F7F6]">{q.subject}</span>
                    <span className="text-[#9BA7A1]">({q.topic})</span>
                  </div>
                  <p className="text-[#9BA7A1] truncate">{q.questionText}</p>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete ${q.id}?`)) deleteQuestion(q.id);
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 shrink-0"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
