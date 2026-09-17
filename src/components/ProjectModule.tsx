/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderGit2, 
  CheckSquare, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Clock, 
  Trash2, 
  DollarSign, 
  FileText,
  User,
  ArrowRight,
  GanttChartSquare,
  UsersRound,
  CheckCircle2
} from 'lucide-react';
import { Project, Task } from '../types';

interface ProjectModuleProps {
  projects: Project[];
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
}

export default function ProjectModule({
  projects,
  tasks,
  onAddTask,
  onUpdateTaskStatus
}: ProjectModuleProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'p-101');
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // New task form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskDue, setTaskDue] = useState('2026-07-15');

  // Meeting Notes state
  const [meetingNotes, setMeetingNotes] = useState<{ id: string; date: string; title: string; note: string }[]>([
    { id: 'm-1', date: '2026-06-20', title: 'Architecture Review & SecOps alignment', note: 'Aligned on private Docker clusters, Firestore encrypted schemas, and AES API keys.' },
    { id: 'm-2', date: '2026-06-25', title: 'LMS Beta Review feedback', note: 'Video CDN player buffers resolved. Digital certificate generation logic approved.' }
  ]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    onAddTask({
      projectId: selectedProjectId,
      title: taskTitle,
      description: taskDesc,
      assignedTo: 'demo-talent-uid',
      status: 'Todo',
      priority: taskPriority,
      dueDate: taskDue
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowTaskForm(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle) return;

    setMeetingNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: noteTitle,
        note: noteContent
      }
    ]);

    setNoteTitle('');
    setNoteContent('');
    setShowNoteForm(false);
  };

  return (
    <div className="space-y-6 text-left" id="project-module-wrapper">
      
      {/* Project Selector tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" id="project-selection-tabs">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedProjectId === p.id
                ? 'bg-[#091527] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {activeProject && (
        <div className="space-y-6" id="active-project-pane">
          {/* Project Summary Header and budget tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="project-header-grid">
            {/* Left columns: Core Summary details */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="project-meta-card">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800">
                    {activeProject.pillar}
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${
                    activeProject.riskLevel === 'High' ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {activeProject.riskLevel} Risk Level
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 leading-snug">{activeProject.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{activeProject.description}</p>
              </div>

              {/* Progress bar info */}
              <div className="space-y-2 pt-2 border-t border-slate-100" id="project-overall-progress">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Pillar Execution Progress</span>
                  <span>{activeProject.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${activeProject.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right column: Financial budget cards */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between" id="project-budget-card">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-left">
                  <DollarSign size={16} className="text-blue-600" />
                  <h4 className="font-bold text-slate-800 text-sm">Pillar Budget Logs</h4>
                </div>

                <div className="grid grid-cols-2 gap-3" id="project-budget-stats">
                  <div className="text-left bg-slate-50 p-2.5 rounded-2xl">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Total Allocated</span>
                    <p className="text-xs font-black text-slate-800 mt-1">IDR {(activeProject.budget / 1000000).toFixed(1)}M</p>
                  </div>

                  <div className="text-left bg-slate-50 p-2.5 rounded-2xl">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Spent To Date</span>
                    <p className="text-xs font-black text-rose-600 mt-1">IDR {(activeProject.spent / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold" id="project-timeline">
                Operational Span: {activeProject.startDate} to {activeProject.endDate}
              </div>
            </div>
          </div>

          {/* SVG Roadmaps & Gantt chart milestone views */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="project-gantt">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
              <GanttChartSquare size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Ecosystem PMO Gantt Timeline</h3>
            </div>

            {/* Simulated interactive Gantt scheduler rows */}
            <div className="space-y-3" id="gantt-grid">
              {[
                { label: 'System Design & DB Blueprints', start: 5, width: 30, color: 'bg-indigo-500' },
                { label: 'Integration & SDK Bootstrapping', start: 30, width: 45, color: 'bg-blue-500' },
                { label: 'Live Deployments & MICE Prep', start: 65, width: 25, color: 'bg-amber-500' }
              ].map((g, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 text-xs font-bold text-slate-700" id={`gantt-row-${idx}`}>
                  <span className="text-left truncate max-w-[150px]">{g.label}</span>
                  <div className="md:col-span-3 bg-slate-50 h-6 rounded-lg relative overflow-hidden">
                    <div
                      className={`h-full ${g.color} opacity-85 rounded-lg flex items-center justify-center text-[8px] text-white font-extrabold`}
                      style={{ marginLeft: `${g.start}%`, width: `${g.width}%` }}
                    >
                      Duration
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Interactive Kanban Task Board */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="project-kanban">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <CheckSquare size={16} className="text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Kanban Board Task Pipelines</h3>
              </div>

              <button
                onClick={() => setShowTaskForm(true)}
                id="add-kanban-task-btn"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Task Card</span>
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="kanban-columns">
              {(['Todo', 'In Progress', 'In Review', 'Done'] as const).map((col) => {
                const colTasks = projectTasks.filter(t => t.status === col);
                return (
                  <div key={col} className="bg-slate-50 p-3 rounded-2xl flex flex-col space-y-3 min-h-[250px]" id={`kanban-col-${col.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black uppercase text-slate-500">{col}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto" id={`kanban-tasks-list-${col.toLowerCase()}`}>
                      {colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm space-y-3 text-left transition-all hover:scale-[1.01]"
                          id={`task-card-${task.id}`}
                        >
                          <div className="space-y-1">
                            <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              task.priority === 'High' ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {task.priority} Priority
                            </span>
                            <h4 className="text-xs font-black text-slate-800 leading-tight pt-1">{task.title}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={11} />
                              <span>{task.dueDate}</span>
                            </div>

                            {/* Clickable state advances */}
                            <div className="flex gap-1" id={`advance-actions-${task.id}`}>
                              {col !== 'Done' && (
                                <button
                                  onClick={() => {
                                    const nextMap: Record<Task['status'], Task['status']> = {
                                      'Todo': 'In Progress',
                                      'In Progress': 'In Review',
                                      'In Review': 'Done',
                                      'Done': 'Done'
                                    };
                                    onUpdateTaskStatus(task.id, nextMap[col]);
                                  }}
                                  className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                                  title="Advance Status"
                                >
                                  <ArrowRight size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meeting Notes section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="project-additional-details">
            {/* Meeting Notes */}
            <div className="md:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="meeting-notes-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-500" />
                  <h3 className="font-bold text-slate-800 text-sm">PMO Meeting Notes Registry</h3>
                </div>

                <button
                  onClick={() => setShowNoteForm(true)}
                  id="add-note-btn"
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="space-y-3" id="notes-list">
                {meetingNotes.map((note) => (
                  <div key={note.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/40 text-left space-y-1" id={`note-item-${note.id}`}>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Ref ID: {note.id}</span>
                      <span>Recorded Date: {note.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{note.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Upload simulations */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between" id="documents-upload-card">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-left">
                  <UsersRound size={16} className="text-blue-600" />
                  <h4 className="font-bold text-slate-800 text-sm">Dossiers & Deliverables</h4>
                </div>

                {/* Simulated file uploads */}
                <div className="border-2 border-dashed border-slate-200 p-4 rounded-2xl text-center space-y-2" id="drag-drop-zone">
                  <FileText size={24} className="mx-auto text-slate-300 animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-500">Drag & drop files here</p>
                  <p className="text-[8px] text-slate-400 leading-normal">Support PDF, Docx, or XLSX project checklists (max 20MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {showTaskForm && (
        <div
          id="task-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="task-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckSquare size={14} className="text-blue-600" />
              <span>Create Kanban Task Card</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4 font-semibold">Project: {activeProject?.name}</p>

            <form onSubmit={handleCreateTask} className="space-y-4 text-left" id="kanban-task-creation-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Redesign UI layouts with Gold theme"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Details of instructions, testing parameters..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Priority Level</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Add Task Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Creation Modal */}
      {showNoteForm && (
        <div
          id="note-modal-backdrop"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-200" id="note-modal">
            <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <FileText size={14} className="text-blue-600" />
              <span>Record PMO Meeting Minutes</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">Record critical takeaways, sync goals, and assign core owners.</p>

            <form onSubmit={handleCreateNote} className="space-y-4 text-left" id="meeting-minutes-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Meeting Topic / Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Clinic telemed EHR encryption check"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Key Takeaways & Notes</label>
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Highlight technical requirements, deadlines or decisions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Record Minutes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
