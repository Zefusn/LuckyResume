export function toTimestamp(dateStr: string | undefined | null): number | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d.getTime()
}

export function fromDateTimestamp(ts: number | null): string {
  if (!ts) return ''
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromDateTimestampDay(ts: number | null): string {
  if (!ts) return ''
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ''
  if (dateStr.length === 7) return dateStr
  if (dateStr.length === 10) return dateStr.slice(0, 7)
  return dateStr
}
