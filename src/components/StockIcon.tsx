import { useState, useEffect } from 'react'
import { getTickerColor, getTickerInitials } from '@/lib/format'

/**
 * Get logo URL for a ticker (uses local proxy to avoid CORS)
 */
export function getStockbitLogoUrl(ticker: string): string {
  return `/api/logo/${ticker}`
}

interface StockIconProps {
  ticker: string
  customIcon?: string | null
  size?: number
}

export function StockIcon({ ticker, customIcon, size = 40 }: StockIconProps) {
  const [imgError, setImgError] = useState(false)
  const bgColor = getTickerColor(ticker)
  const initials = getTickerInitials(ticker)

  // Reset error state when ticker changes
  useEffect(() => {
    setImgError(false)
  }, [ticker])

  const handleError = () => {
    setImgError(true)
  }

  // Shared image styles (inline to avoid oklch issues with html2canvas)
  const imgStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  }

  // Custom icon takes priority
  if (customIcon) {
    return <img src={customIcon} alt={ticker} style={imgStyle} />
  }

  // Try Stockbit logo, fallback to placeholder on error
  if (!imgError && ticker) {
    return (
      <img
        src={getStockbitLogoUrl(ticker)}
        alt={ticker}
        onError={handleError}
        style={imgStyle}
      />
    )
  }

  // Fallback: color placeholder with initials
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: '#ffffff',
          fontWeight: 600,
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </span>
    </div>
  )
}

interface StockIconUploadProps {
  ticker: string
  customIcon?: string | null
  onUpload: (dataUrl: string | null) => void
}

export function StockIconUpload({
  ticker,
  customIcon,
  onUpload,
}: StockIconUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      onUpload(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    onUpload(null)
  }

  return (
    <div className="flex items-center gap-3">
      <StockIcon ticker={ticker} customIcon={customIcon} size={48} />
      <div className="flex flex-col gap-1">
        <label
          className="cursor-pointer text-sm font-medium transition-colors"
          style={{ color: 'var(--primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
        >
          <span>Upload logo</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {customIcon && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-left transition-colors"
            style={{ color: 'var(--spectrum-gray-600)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--spectrum-gray-800)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--spectrum-gray-600)'}
          >
            Reset to default
          </button>
        )}
      </div>
    </div>
  )
}
