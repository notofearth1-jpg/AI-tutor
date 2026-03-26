"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api.client";
import { GraduationCap, ArrowLeft, Send, Sparkles, CheckCircle2, Loader2, BookOpen, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LearnPage() {
  const { topic: topicSlug } = useParams<{ topic: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lesson" | "assignment">("lesson");
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (topicSlug) loadContent();
  }, [topicSlug]);

  const loadContent = async () => {
    try {
      // 1. In a real app, we'd find the lesson by topic slug
      // For demo, we trigger generation or check existing
      const res = await api.post("/lessons", { topicSlug });
      // Poll for completion or simple fallback
      setLoading(false);
      // Dummy content for demo if job is queued
      setLesson({
        title: topicSlug.replaceAll("_", " "),
        contentMarkdown: "### Welcome to your Personalized Lesson\n\nOur AI is currently preparing the high-depth tutorial for you. In a production environment, this page would live-update as the Teacher Agent completes its work.\n\n### Core Concepts\n1. Foundations of " + topicSlug + "\n2. Advanced applications\n3. Practical exercise.",
        recap: ["Focus on fundamentals", "Practice daily"],
        reflectionQuestions: ["What is your biggest takeaway?"]
      });
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAssignment = async () => {
    setLoading(true);
    try {
      const res = await api.post("/assignments", { lessonId: "demo-id" });
      setAssignment({
        id: "demo-id",
        title: "Mastery Check",
        questions: [
          { q: "What is the primary role of an AI Agent?", options: ["Automate tasks", "Replace humans", "Generate images", "Browse web"] },
          { q: "Which core agent maps lessons?", options: ["Teacher", "Course Creator", "Supervisor", "Progress Coach"] }
        ]
      });
      setActiveTab("assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/assignments/submit", { assignmentId: "demo-id", answers });
      setResult({ score: 90, feedback: "Excellent understanding of the core architecture!" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-sm font-bold text-gray-500">
           <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <div className="flex items-center gap-2">
           <GraduationCap className="h-6 w-6 text-primary-600" />
           <span className="font-extrabold tracking-tighter text-lg uppercase">{topicSlug.replaceAll('_', ' ')}</span>
        </div>
        <div className="w-24"></div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
          ) : lesson ? (
            <div className="max-w-3xl mx-auto">
               <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">{lesson.title}</h1>
               <div className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed mb-12">
                 {lesson.contentMarkdown.split('\n').map((line: string, i: number) => (
                   <div key={i} className="mb-4">{line}</div>
                 ))}
               </div>

               <div className="border-t pt-10 mt-10">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500" /> Key Recaps
                 </h3>
                 <ul className="space-y-3">
                   {lesson.recap.map((r: string, idx: number) => (
                     <li key={idx} className="flex gap-3 text-gray-600 font-medium">
                       <span className="text-primary-600">•</span> {r}
                     </li>
                   ))}
                 </ul>
               </div>

               <button
                  onClick={handleAssignment}
                  className="mt-12 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all hover:-translate-y-1"
                >
                  Start Mastery Assessment <Sparkles className="h-5 w-5" />
                </button>
            </div>
          ) : null}
        </main>

        {/* Right: Interaction Panel */}
        <aside className="w-[400px] border-l hidden xl:flex flex-col bg-gray-50">
          <div className="p-6 border-b flex gap-1">
             <button
               onClick={() => setActiveTab("lesson")}
               className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'lesson' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-900'}`}
             >
               <BookOpen className="h-4 w-4" /> Tutor Chat
             </button>
             <button
               onClick={() => setActiveTab("assignment")}
               className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'assignment' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-900'}`}
             >
               <ClipboardCheck className="h-4 w-4" /> Assignment
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'lesson' ? (
              <div className="h-full flex flex-col">
                 <div className="flex-1 space-y-4 mb-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm">
                       Hello! I am your AI Progress Coach. How can I help you understand this lesson better?
                    </div>
                 </div>
                 <div className="relative">
                    <input className="w-full px-4 py-4 pr-12 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 text-sm shadow-inner" placeholder="Ask a question..." />
                    <button className="absolute right-3 top-3 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                       <Send className="h-4 w-4" />
                    </button>
                 </div>
              </div>
            ) : assignment ? (
               <div className="space-y-8">
                  <div className="p-4 bg-primary-600 rounded-3xl text-white">
                      <h4 className="font-bold flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4" /> AI Checkup</h4>
                      <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Answer these to unlock the next level</p>
                  </div>

                  {result ? (
                    <div className="p-8 bg-green-50 rounded-[40px] border border-green-100 text-center animate-in fade-in zoom-in duration-500">
                       <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-6 shadow-lg shadow-green-200">
                          {result.score}%
                       </div>
                       <h3 className="text-2xl font-extrabold text-green-900 mb-2">Great Work!</h3>
                       <p className="text-green-700/70 text-sm leading-relaxed mb-8">{result.feedback}</p>
                       <button onClick={() => router.push('/dashboard')} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all">
                          Return to Dashboard
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       {assignment.questions.map((q: any, i: number) => (
                         <div key={i} className="space-y-3">
                            <p className="font-bold text-gray-900">{i+1}. {q.q}</p>
                            <div className="grid gap-2">
                               {q.options.map((opt: string) => (
                                 <button
                                   key={opt}
                                   className="px-4 py-3 bg-white border border-gray-100 rounded-xl text-left text-sm font-medium hover:border-primary-600 hover:bg-primary-50 transition-all"
                                 >
                                    {opt}
                                 </button>
                               ))}
                            </div>
                         </div>
                       ))}
                       <button
                         onClick={handleSubmit}
                         disabled={submitting}
                         className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                       >
                          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Assignment"}
                       </button>
                    </div>
                  )}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <ClipboardCheck className="h-10 w-10 mb-2" />
                  <p className="font-bold uppercase tracking-widest text-xs">Complete the lesson first</p>
               </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
