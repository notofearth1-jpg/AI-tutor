"use client";

import { useAuth } from "@/hooks/use-auth";
import { GraduationCap, LogOut, LayoutDashboard, Settings, UserCircle, Bell, Eye, Lock, Globe } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold uppercase tracking-tight">AI Tutor</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium">
            <UserCircle className="h-5 w-5" /> My Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium mt-auto">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Settings</h1>
          <p className="text-gray-500 mt-2 text-lg">Personalize your learning environment and notification preferences.</p>
        </header>

        <div className="max-w-3xl space-y-8">
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Application Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                       <Bell className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                       <span className="font-bold text-gray-900">Email Notifications</span>
                       <span className="text-sm text-gray-500 block">Get study reminders and grade reports.</span>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-primary-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors opacity-60">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                       <Eye className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                       <span className="font-bold text-gray-900">Visual Style (Beta)</span>
                       <span className="text-sm text-gray-500 block">Switch between light and dark mode.</span>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                       <Globe className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                       <span className="font-bold text-gray-900">Preferred Language</span>
                       <span className="text-sm text-gray-500 block">Current: English (EN)</span>
                    </div>
                 </div>
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50">Change</button>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Security & Privacy</h2>
            <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                       <Lock className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                       <span className="font-bold text-gray-900">Update Password</span>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4 text-red-500">
                       <LogOut className="h-5 w-5" />
                       <span className="font-bold">Logout of all sessions</span>
                    </div>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                 </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
