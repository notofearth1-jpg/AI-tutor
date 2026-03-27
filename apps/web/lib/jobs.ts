import { apiFetch } from "./api";
import { unwrapApiResponse } from "./unwrap";

export async function getJobStatus(type: "lesson" | "assignment" | "grading", id: string) {
  const res = await apiFetch(`/jobs/${type}/${id}`);
  return unwrapApiResponse(res);
}
