"use client";

import Link from "next/link";
import { MoveRight, GraduationCap, Zap, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold tracking-tight">AI TUTOR</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <Link href="#features" className="hover:text-primary-600">Features</Link>
          <Link href="/dashboard" className="hover:text-primary-600">Dashboard</Link>
          <Link href="/login" className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">Login</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-6 border border-primary-100">
            <Zap className="h-3 w-3" />
            <span>Next-Gen Personalized Learning</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
            Master Any Topic with your <span className="text-primary-600">Personal AI Tutor</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience a learning journey tailored to your unique pace, goals, and style. Powered by multi-agent AI that adapts to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200">
              Get Started for Free <MoveRight className="h-5 w-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-sm">
              Explore Topics
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50 border-y border-gray-100 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 font-bold">01</div>
              <h3 className="text-xl font-bold mb-4">Course Creator</h3>
              <p className="text-gray-500">Maps out a personalized curriculum based on your existing knowledge and goals.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 font-bold">02</div>
              <h3 className="text-xl font-bold mb-4">AI Teacher</h3>
              <p className="text-gray-500">Generates rich lessons and explains complex concepts in a style you understand.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 font-bold">03</div>
              <h3 className="text-xl font-bold mb-4">Progress Coach</h3>
              <p className="text-gray-500">Grades your work, tracks your mastery, and keeps you motivated every step of the way.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t bg-white text-center text-gray-500 text-sm">
        <p>&copy; 2026 AI Tutor Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
