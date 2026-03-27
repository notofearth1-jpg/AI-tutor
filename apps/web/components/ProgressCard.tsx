import Card from "./Card";
import SectionTitle from "./SectionTitle";

type ProgressData = {
  mastery: { id: string; topicSlug: string; masteryScore: number; confidenceScore: number; attempts: number; lastUpdated: string }[];
  submissions: { id: string; submittedAt: string; assignment: { title: string; topicSlug: string }; grade: { score: number; maxScore: number; feedback: string } | null }[];
};

export default function ProgressCard({ progress }: { progress: ProgressData | null }) {
  return (
    <Card>
      <SectionTitle title="Learning Progress" subtitle="Progress is based on submissions and topic mastery." />
      {!progress ? (
        <p className="text-slate-300">No progress data available.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Topic Mastery</h3>
            <div className="mt-3 space-y-3">
              {progress.mastery?.length ? (
                progress.mastery.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.topicSlug}</p>
                      <p className="text-cyan-400">{item.masteryScore.toFixed(1)}%</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      Attempts: {item.attempts} | Confidence: {(item.confidenceScore * 100).toFixed(0)}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No mastery records yet.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Recent Submissions</h3>
            <div className="mt-3 space-y-3">
              {progress.submissions?.length ? (
                progress.submissions.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-700 p-4">
                    <p className="font-medium">{item.assignment.title}</p>
                    <p className="text-sm text-slate-300">{item.assignment.topicSlug}</p>
                    <p className="mt-2 text-sm">
                      Score: <span className="text-cyan-400">
                        {item.grade ? `${item.grade.score}/${item.grade.maxScore}` : "Not graded"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No submissions yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
