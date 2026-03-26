"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api.client";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert, Activity, DollarSign, Database, Users, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [runs, setRuns] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'ai_ops') {
      // router.push('/dashboard');
    }
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      const [runsRes, statsRes] = await Promise.all([
        api.get("/admin/agent-runs?limit=10"),
        api.get("/admin/agent-costs")
      ]);
      setRuns(runsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
       {/* Sidebar - Shared pattern */}
       <aside className="w-64 border-r hidden md:flex flex-col p-6 bg-white sticky top-0 h-screen">
          <div className="flex items-center gap-2 mb-10">
            <ShieldAlert className="h-8 w-8 text-black" />
            <span className="text-xl font-bold tracking-tighter">OPS CENTER</span>
          </div>
          <nav className="space-y-1">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Management</p>
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/10">
               <Activity className="h-5 w-5" /> Agent Health
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
               <Database className="h-5 w-5" /> Prompt Registry
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
               <Users className="h-5 w-5" /> User Access
             </button>
          </nav>
       </aside>

       <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <header className="mb-12 flex justify-between items-end">
             <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
                <p className="text-gray-500 mt-1 text-lg">Real-time monitoring of multi-agent workflows</p>
             </div>
             <button onClick={loadAdminData} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
                Refresh Metrics
             </button>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4"><Activity className="h-5 w-5" /></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Jobs</p>
                <p className="text-2xl font-extrabold">12</p>
             </div>
             <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4"><Check className="h-5 w-5" /></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
                <p className="text-2xl font-extrabold">98.4%</p>
             </div>
             <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-4"><DollarSign className="h-5 w-5" /></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">MTD Spend</p>
                <p className="text-2xl font-extrabold">$42.85</p>
             </div>
             <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4"><ShieldAlert className="h-5 w-5" /></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Incident Report</p>
                <p className="text-2xl font-extrabold">0</p>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             <section className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Recent Agent Runs</h3>
                <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Agent</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Model</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Latency</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y">
                         {runs.map((run: any) => (
                           <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                 <span className="font-bold text-sm block">{run.agentType}</span>
                                 <span className="text-[10px] text-gray-400 font-mono">{run.id.slice(0, 8)}</span>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-500 font-medium">{run.modelUsed}</td>
                              <td className="px-6 py-4 text-xs font-bold">{run.latencyMs}ms</td>
                              <td className="px-6 py-4">
                                 <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-md uppercase border border-green-100">
                                   {run.status}
                                 </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                   <div className="p-4 border-t text-center">
                      <button className="text-xs font-bold text-primary-600 hover:underline flex items-center justify-center gap-1 mx-auto">
                        View All Logs <ChevronRight className="h-4 w-4" />
                      </button>
                   </div>
                </div>
             </section>

             <section>
                <h3 className="text-xl font-bold mb-6">Cost Distribution</h3>
                <div className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm">
                   {stats ? (
                     <div className="space-y-6">
                        {Object.entries(stats).map(([key, val]: any) => (
                           <div key={key}>
                              <div className="flex justify-between text-xs font-bold mb-2">
                                 <span className="text-gray-500 uppercase tracking-tighter">{key}</span>
                                 <span>${val.totalCost.toFixed(4)}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                 <div className="h-full bg-black rounded-full" style={{ width: '40%' }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                   ) : <p className="text-gray-400 text-sm italic">Loading cost analysis...</p>}
                </div>
             </section>
          </div>
       </main>
    </div>
  );
}
