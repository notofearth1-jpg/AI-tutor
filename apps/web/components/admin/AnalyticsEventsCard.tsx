import Card from "../Card";
import SectionTitle from "../SectionTitle";

export default function AnalyticsEventsCard({ events }: { events: any[] }) {
  return (
    <Card>
      <SectionTitle title="Analytics Events" subtitle="Recent platform and product events." />
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-cyan-400">{event.eventName}</p>
                <p className="text-sm text-slate-300">
                  User: {event.userId ?? "anonymous"} | Session: {event.sessionId ?? "-"}
                </p>
              </div>
              <p className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
            {event.properties && (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
                {JSON.stringify(event.properties, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
