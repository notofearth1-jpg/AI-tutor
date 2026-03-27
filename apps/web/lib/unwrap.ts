export function unwrapApiResponse<T>(payload: any): T {
  if (payload && typeof payload === "object" && "data" in payload) return payload.data as T;
  return payload as T;
}
