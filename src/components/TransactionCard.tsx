import { forwardRef } from 'react'
import { StockIcon } from './StockIcon'
import { formatNumber, formatDate, formatRealizedGain } from '@/lib/format'

export interface TransactionData {
  type: 'BUY' | 'SELL'
  ticker: string
  companyName: string
  board: 'Utama' | 'Pengembangan' | 'Pemantauan Khusus' | 'Akselerasi'
  date: Date
  price: number
  lotDone: number
  amount: number
  totalFee: number
  netAmount: number
  buyPrice: number // untuk auto-calculate realized gain
  realizedGain: number
  realizedGainPercent: number
  iconUrl?: string | null
}

interface TransactionCardProps {
  data: TransactionData
}

// Using all inline styles to avoid oklch color issues with html2canvas
export const TransactionCard = forwardRef<HTMLDivElement, TransactionCardProps>(
  ({ data }, ref) => {
    const isProfit = data.realizedGain >= 0

    return (
      <div
        ref={ref}
        style={{
          width: 520,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          position: 'relative',
          boxShadow:
            'rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
          fontFamily:
            '-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        }}
      >
        {/* Close Button */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          ×
        </div>

        {/* Title Section */}
        <div style={{ padding: 20 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'center',
              color: '#333333',
              margin: 0,
            }}
          >
            {data.type} {data.ticker}
          </h2>
        </div>

        {/* Stock Row Box */}
        <div style={{ padding: '0 20px' }}>
          <div
            style={{
              border: '1px solid #ededed',
              borderRadius: 4,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <StockIcon
              ticker={data.ticker}
              customIcon={data.iconUrl}
              size={40}
            />
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#333333',
                  }}
                >
                  {data.ticker}
                </span>
                {data.board === 'Pengembangan' && (
                  <span
                    style={{
                      border: '1px solid #00ab6b',
                      borderRadius: 4,
                      padding: '2px 5px',
                      fontSize: 12,
                      color: '#00ab6b',
                      lineHeight: 1,
                    }}
                  >
                    DBX
                  </span>
                )}
                {data.board === 'Pemantauan Khusus' && (
                  <span style={{ color: '#f5a623', fontSize: 14 }}>
                    ⚠️
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#b5b5b5',
                  marginTop: 3,
                }}
              >
                {data.companyName}
              </div>
            </div>
            <span style={{ color: '#b5b5b5', fontSize: 18 }}>›</span>
          </div>
        </div>

        {/* Data Section Box */}
        <div style={{ padding: '16px 20px 20px' }}>
          <div
            style={{
              border: '1px solid #ededed',
              borderRadius: 4,
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <DataRow label="Date" value={formatDate(data.date)} />
              <DataRow label="Price" value={formatNumber(data.price)} />
              <DataRow label="Lot Done" value={formatNumber(data.lotDone)} />
              <DataRow label="Amount" value={formatNumber(data.amount)} />
              <DataRow label="Total Fee" value={formatNumber(data.totalFee)} />
              <DataRow
                label="Net Amount"
                value={formatNumber(data.netAmount)}
                bold
              />
              {/* Realized Gain only shown for SELL transactions */}
              {data.type === 'SELL' && (
                <DataRow
                  label="Realized Gain"
                  value={formatRealizedGain(
                    data.realizedGain,
                    data.realizedGainPercent
                  )}
                  bold
                  color={isProfit ? '#00ab6b' : '#e84142'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

TransactionCard.displayName = 'TransactionCard'

interface DataRowProps {
  label: string
  value: string
  bold?: boolean
  color?: string
}

function DataRow({ label, value, bold, color }: DataRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 17,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: bold ? 600 : 400,
          color: '#333333',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: bold ? 600 : 400,
          color: color || '#333333',
        }}
      >
        {value}
      </span>
    </div>
  )
}
