"use client";

import { useAuth } from "@/hooks/use-auth";
import { GraduationCap, LogOut, LayoutDashboard, Settings, UserCircle, Mail, Shield, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
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
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold">
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
      <main className="flex-1 p-8 md:p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">My Profile</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your personal information and track your progress.</p>
        </header>

        <div className="max-w-4xl space-y-8">
          <section className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                <UserCircle className="h-16 w-16" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.email.split('@')[0]}</h2>
                <p className="text-gray-500">{user.role.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Email</span>
                  <span className="font-semibold text-gray-900">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Account Role</span>
                  <span className="font-semibold text-gray-900">{user.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Member Since</span>
                  <span className="font-semibold text-gray-900">March 2026</span>
                </div>
              </div>
            </div>
          </section>

          <section className="p-8 bg-black rounded-[40px] text-white">
            <h3 className="text-2xl font-bold mb-6">Learning Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <span className="block text-3xl font-bold text-primary-400">0</span>
                <span className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1 block">Lessons</span>
              </div>
              <div className="text-center p-4">
                <span className="block text-3xl font-bold text-primary-400">0%</span>
                <span className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1 block">Avg Grade</span>
              </div>
              <div className="text-center p-4">
                <span className="block text-3xl font-bold text-primary-400">0</span>
                <span className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1 block">Assignments</span>
              </div>
              <div className="text-center p-4">
                <span className="block text-3xl font-bold text-primary-400">Stable</span>
                <span className="text-xs text-white/50 uppercase font-bold tracking-widest mt-1 block">Velocity</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
