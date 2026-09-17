/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Play, 
  CheckSquare, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Trophy,
  Loader2
} from 'lucide-react';
import { Course } from '../types';

interface TrainingModuleProps {
  courses: Course[];
  onCompleteCourse: (courseId: string) => void;
}

export default function TrainingModule({ courses, onCompleteCourse }: TrainingModuleProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const mockLessons = [
    { id: 'l-1', title: '1. Introduction to Digital Business Ecosystems', duration: '14:20' },
    { id: 'l-2', title: '2. Structuring PMO Resource Allocation Models', duration: '22:15' },
    { id: 'l-3', title: '3. Formulating Secure Cloud Architecture Schemas', duration: '18:40' }
  ];

  const quizQuestion = {
    text: "Which Firebase product is ideal for structuring real-time synchronized data logs across DINESYS business pillars?",
    options: ["Firebase Firestore Database", "Firebase Realtime Hosting", "Cloud Functions Serverless"],
    correct: "Firebase Firestore Database"
  };

  const handleQuizSubmit = (courseId: string) => {
    if (selectedAnswer === quizQuestion.correct) {
      setQuizSubmitted((prev) => ({ ...prev, [courseId]: true }));
      onCompleteCourse(courseId);
    } else {
      alert("❌ Incorrect answer. Please review chapter materials and retry!");
    }
  };

  return (
    <div className="space-y-6 text-left" id="training-module-wrapper">
      
      {/* Upper Grid Layout: Courses Catalog vs Class Agendas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="training-split-grid">
        {/* Left Columns: Courses Enrolled */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="courses-catalog-card">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <GraduationCap size={16} className="text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Professional Academy Enrolments</h3>
          </div>

          <div className="space-y-4" id="courses-list">
            {courses.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              const quizDone = quizSubmitted[course.id] || (course.progress && course.progress >= 100);

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedAnswer(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/10'
                      : 'border-slate-200/60 hover:bg-slate-50/50'
                  }`}
                  id={`course-item-${course.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900">{course.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{course.description}</p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 shrink-0">Instructor: {course.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1" id={`course-progress-bar-${course.id}`}>
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] font-semibold text-slate-400 mb-1">
                        <span>LMS Training Progress</span>
                        <span>{quizDone ? '100' : (course.progress || 0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${quizDone ? 100 : (course.progress || 0)}%` }}
                        />
                      </div>
                    </div>

                    {quizDone ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourse(course);
                          setShowCertificate(true);
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-[10px] font-bold shadow-sm cursor-pointer flex items-center gap-1 shrink-0"
                        id={`view-cert-btn-${course.id}`}
                      >
                        <Award size={12} />
                        <span>View Certificate</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Complete final exam to verify</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Class Player */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between" id="class-player-card">
          <div className="space-y-4 text-left" id="class-player-top">
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
              <BookOpen size={15} className="text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Course Lectures</h3>
            </div>

            <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col justify-center items-center text-white p-4 text-center space-y-2 relative overflow-hidden" id="video-stream-box">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80')]" />
              <div className="relative z-10 space-y-1">
                <Play size={28} className="mx-auto text-amber-400 fill-amber-400" />
                <p className="text-[10px] uppercase font-bold text-slate-300">Chapter Lecture Video</p>
                <p className="text-[11px] font-bold truncate max-w-[200px]">{selectedCourse?.title}</p>
              </div>
            </div>

            <div className="space-y-1.5" id="lessons-outline">
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Lecture Outline</p>
              <div className="space-y-1">
                {mockLessons.map((les) => (
                  <div key={les.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-slate-100 text-[10px] text-slate-600">
                    <span className="font-medium truncate max-w-[180px]">{les.title}</span>
                    <span className="text-slate-400 shrink-0 flex items-center gap-0.5 font-bold">
                      <Clock size={10} />
                      {les.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Final Quiz section */}
      {selectedCourse && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-sm space-y-4" id="course-quiz-exam">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-left">
            <HelpCircle size={16} className="text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm">Active Enrolment Exam: {selectedCourse.title}</h3>
          </div>

          {quizSubmitted[selectedCourse.id] || (selectedCourse.progress && selectedCourse.progress >= 100) ? (
            <div className="p-8 text-center max-w-md mx-auto space-y-3" id="exam-success-pane">
              <Trophy size={42} className="mx-auto text-amber-500 animate-bounce" />
              <h4 className="text-sm font-bold text-slate-800">Chapter Passed!</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                You successfully answered the chapter query. Your verified credentials have been synchronized to PT. Sepuh Trismatek Nusa registries. Click to view your completable PDF cert below.
              </p>
              <button
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs tracking-wider uppercase cursor-pointer"
              >
                Launch Certificate PDF
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-left" id="quiz-question-pane">
              <p className="text-xs font-bold text-slate-800">{quizQuestion.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {quizQuestion.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`p-3.5 rounded-2xl border text-xs text-left font-medium transition-all cursor-pointer ${
                      selectedAnswer === opt
                        ? 'border-blue-500 bg-blue-50/20 text-blue-800'
                        : 'border-slate-200/60 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleQuizSubmit(selectedCourse.id)}
                  disabled={!selectedAnswer}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Submit Answer Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion digital certificate display popup */}
      {showCertificate && selectedCourse && (
        <div
          id="cert-modal-backdrop"
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#111827] text-white rounded-3xl p-8 max-w-2xl w-full border border-amber-400/40 shadow-2xl relative" id="certificate-modal">
            {/* Elegant Certificate Border */}
            <div className="border-4 border-double border-amber-400/60 p-8 space-y-6 text-center relative" id="certificate-border-box">
              
              <div className="flex flex-col items-center gap-1">
                <Trophy size={40} className="text-amber-400" />
                <h2 className="font-serif text-2xl font-black text-amber-400 tracking-wider">CERTIFICATE OF COMPLETION</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DINESYS ACADEMY PILLAR</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-300 italic">This credential is proudly awarded to</p>
                <p className="text-lg font-bold text-white border-b border-amber-400/25 max-w-sm mx-auto pb-1">ENTERPRISE TALENT STUDENT</p>
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <p className="text-xs text-slate-300">for successfully undergoing coursework and mastering key skills in:</p>
                <p className="text-sm font-black text-amber-300 uppercase">{selectedCourse.title}</p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Course syllabus includes ERP systems integration, Firestore security boundaries, MICE operational scheduling, and telemedicine EHR registries.
                </p>
              </div>

              {/* Footer signatures */}
              <div className="flex justify-between items-center pt-6 text-xs max-w-md mx-auto" id="certificate-signatures">
                <div className="text-center flex flex-col">
                  <span className="font-semibold text-slate-100">Ahmad Sepuh</span>
                  <span className="text-[9px] text-slate-400 font-bold border-t border-slate-800 pt-1 uppercase tracking-wider">Chief PMO Architect</span>
                </div>

                <div className="text-center flex flex-col">
                  <span className="font-semibold text-slate-100">DINESYS UT Verified</span>
                  <span className="text-[9px] text-slate-400 font-bold border-t border-slate-800 pt-1 uppercase tracking-wider">Blockchain ID: #UT-2026-X</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
                id="close-cert-btn"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
