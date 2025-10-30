export function fmtDate(epoch?: number) {
  if (!epoch) return "—";
  try {
    return new Date(epoch * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return String(epoch);
  }
}
