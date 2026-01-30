/**
 * Format number with thousand separator (Indonesian style: 1.234.567)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

/**
 * Format number with decimal places
 */
export function formatDecimal(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format realized gain with sign and percentage
 * e.g., "+28,194.60 (+3.98%)" or "-5,000.00 (-2.50%)"
 */
export function formatRealizedGain(value: number, percent: number): string {
  const sign = value >= 0 ? '+' : ''
  const percentSign = percent >= 0 ? '+' : ''
  return `${sign}${formatDecimal(value)} (${percentSign}${formatDecimal(percent)}%)`
}

/**
 * Format date to "1 Oct 2025" format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Parse formatted number string back to number
 */
export function parseFormattedNumber(value: string): number {
  // Remove thousand separators (dots in Indonesian format)
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

/**
 * Icon colors for stock placeholder
 */
export const ICON_COLORS = [
  '#f5a623', // orange
  '#1890ff', // blue
  '#00ab6b', // green
  '#722ed1', // purple
  '#e84142', // red
] as const

/**
 * Get consistent color for a ticker based on hash
 */
export function getTickerColor(ticker: string): string {
  let hash = 0
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % ICON_COLORS.length
  return ICON_COLORS[index]
}

/**
 * Get initials from ticker (first 2 characters)
 */
export function getTickerInitials(ticker: string): string {
  return ticker.slice(0, 2).toUpperCase()
}
