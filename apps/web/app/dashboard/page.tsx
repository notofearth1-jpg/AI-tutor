"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Card from "../../components/Card";
import SectionTitle from "../../components/SectionTitle";
import ProfileForm from "../../components/ProfileForm";
import PlanCard from "../../components/PlanCard";
import LessonCard from "../../components/LessonCard";
import AssignmentCard from "../../components/AssignmentCard";
import ProgressCard from "../../components/ProgressCard";
import { getUserId } from "../../lib/storage";
import { apiFetch } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import { unwrapApiResponse } from "../../lib/unwrap";

function DashboardInner() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => { setUserId(getUserId()); }, []);
  useEffect(() => { if (!userId) return; refreshAll(userId); }, [userId]);

  async function refreshAll(id: string) {
    try {
      const pRes = await apiFetch<any>(`/students/profile/${id}`);
      setProfile(unwrapApiResponse(pRes));
      const planRes = await apiFetch<any>(`/plans/${id}`).catch(() => null);
      if (planRes) setPlan(unwrapApiResponse(planRes));
      const progRes = await apiFetch<any>(`/progress/${id}`).catch(() => null);
      if (progRes) setProgress(unwrapApiResponse(progRes));
    } catch { }
  }

  async function generatePlan() {
    if (!userId) return;
    setLoadingPlan(true);
    try {
      const created = await apiFetch<any>("/plans", {
        method: "POST",
        body: JSON.stringify({ userId })
      });
      setPlan(unwrapApiResponse(created));
    } finally { setLoadingPlan(false); }
  }

  async function handleLessonCreated(lessonId: string) {
    const data = await apiFetch<any>(`/lessons/${lessonId}`);
    setLesson(unwrapApiResponse(data));
    setAssignment(null);
    if (userId) {
      const prog = await apiFetch<any>(`/progress/${userId}`).catch(() => null);
      if (prog) setProgress(unwrapApiResponse(prog));
    }
  }

  async function handleAssignmentCreated(assignmentId: string) {
    const data = await apiFetch<any>(`/assignments/${assignmentId}`);
    const assignmentData = unwrapApiResponse<any>(data);
    setAssignment({ ...assignmentData, questions: Array.isArray(assignmentData.questions) ? assignmentData.questions : [] });
  }

  if (!userId) {
    return (
      <Card>
        <SectionTitle title="No active user" subtitle="Create an account or login first." />
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {!profile ? (
        <ProfileForm userId={userId} onCreated={() => refreshAll(userId)} />
      ) : (
        <Card>
          <SectionTitle title={`Welcome, ${profile.fullName}`} subtitle="Your personalized AI learning workspace" />
          <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            <p><span className="font-semibold">Level:</span> {profile.selfReportedLevel}</p>
            <p><span className="font-semibold">Language:</span> {profile.preferredLanguage}</p>
            <p><span className="font-semibold">Age range:</span> {profile.ageRange}</p>
            <p><span className="font-semibold">Learning style:</span> {profile.preferredLearningStyle}</p>
          </div>
          <button onClick={generatePlan} disabled={loadingPlan}
            className="mt-4 rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50">
            {loadingPlan ? "Generating..." : "Generate Learning Plan"}
          </button>
        </Card>
      )}
      <PlanCard userId={userId} plan={plan} onLessonCreated={handleLessonCreated} />
      <LessonCard userId={userId} lesson={lesson} onAssignmentCreated={handleAssignmentCreated} />
      <AssignmentCard userId={userId} assignment={assignment} />
      <ProgressCard progress={progress} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <AuthGuard
        fallback={
          <div className="mx-auto max-w-4xl px-6 py-10">
            <Card>
              <SectionTitle title="Unauthorized" subtitle="Please log in to access the dashboard." />
            </Card>
          </div>
        }
      >
        <DashboardInner />
      </AuthGuard>
    </main>
  );
}
