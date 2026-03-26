"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { api } from "../lib/api.client";
import { GraduationCap, LogOut, LayoutDashboard, Settings, UserCircle, Plus, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPlan();
  }, [user]);

  const loadPlan = async () => {
    try {
      const res = await api.get(`/plans/${user.id}`);
      setPlan(res.data);
    } catch (err) {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post("/plans");
      setPlan(res.data);
    } catch (err) {
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold uppercase tracking-tight">AI Tutor</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
            <UserCircle className="h-5 w-5" /> My Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium mt-auto">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Hello, {user?.email?.split('@')[0] || 'Learner'} 👋</h1>
            <p className="text-gray-500 mt-2 text-lg">Ready to master something new today?</p>
          </div>
          <div className="hidden sm:block">
             <div className="w-12 h-12 bg-gray-100 rounded-full border border-gray-200"></div>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Personalizing your experience...</p>
          </div>
        ) : plan ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Current Course: <span className="text-primary-600">{plan.studentLevel} Path</span></h2>
                  <div className="px-4 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100 uppercase">Active</div>
                </div>

                <div className="grid gap-4">
                  {Object.entries(plan.modules || {}).map(([key, mod]: any, idx) => (
                    <div key={key} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{mod.title}</h4>
                          <p className="text-gray-500 text-sm mb-4">{mod.description}</p>
                          <div className="flex flex-wrap gap-2">
                             {mod.topics.map((t: string) => (
                               <Link key={t} href={`/learn/${t}`} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-lg border border-gray-100 hover:border-primary-100 hover:bg-primary-50 hover:text-primary-600 transition-all flex items-center gap-2">
                                <BookOpen className="h-3 w-3" /> {t.replaceAll('_', ' ')}
                               </Link>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="p-8 bg-black rounded-[40px] text-white overflow-hidden relative">
                <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                     <Sparkles className="h-6 w-6 text-yellow-400" />
                     Learning Insights
                   </h3>
                   <div className="space-y-4">
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                         <span className="text-xs text-white/50 block mb-1 font-bold uppercase tracking-wider">Skill Level</span>
                         <span className="text-xl font-bold">{plan.studentLevel}</span>
                      </div>
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                         <span className="text-xs text-white/50 block mb-1 font-bold uppercase tracking-wider">Gap Identified</span>
                         <span className="text-sm font-medium">{plan.knowledgeGaps?.[0] || 'Analyzing...'}</span>
                      </div>
                   </div>
                   <button className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors">
                     Download Progress Report
                   </button>
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full blur-[60px] opacity-30 -mr-16 -mt-16"></div>
              </section>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-8 animate-bounce transition-all duration-1000">
               <GraduationCap className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Setup your Learning Path</h2>
            <p className="text-gray-500 max-w-md mb-10 text-lg leading-relaxed">
              We need to map your goals and existing knowledge to create the most efficient path to mastery.
            </p>
            <button
               onClick={generatePlan}
               className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-primary-700 transition-all shadow-xl shadow-primary-200"
            >
               Generate My Path <Sparkles className="h-6 w-6" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
