import { useState, useRef, useEffect } from 'react'
import stocks from '@/data/stocks.json'

export interface Stock {
  code: string
  name: string
  listingDate: string
  shares: string
  board: 'Utama' | 'Pengembangan' | 'Pemantauan Khusus' | 'Akselerasi'
}

interface StockSearchProps {
  value: string
  onChange: (stock: Stock | null) => void
}

export function StockSearch({ value, onChange }: StockSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(value)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredStocks = (stocks as Stock[]).filter(
    (stock) =>
      stock.code.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50) // Limit to 50 results for performance

  useEffect(() => {
    setSearch(value)
  }, [value])

  useEffect(() => {
    setHighlightIndex(0)
  }, [search])

  const handleSelect = (stock: Stock) => {
    setSearch(stock.code)
    onChange(stock)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((prev) =>
          prev < filteredStocks.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredStocks[highlightIndex]) {
          handleSelect(filteredStocks[highlightIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedItem = listRef.current.children[
        highlightIndex
      ] as HTMLElement
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightIndex, isOpen])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setIsOpen(true)
          if (!e.target.value) {
            onChange(null)
          }
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          // Delay to allow click on dropdown item
          setTimeout(() => setIsOpen(false), 200)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search ticker..."
        className="w-full px-3 py-2 text-sm border rounded-md transition-colors focus:outline-none focus:ring-2"
        style={{
          backgroundColor: 'var(--input)',
          borderColor: 'var(--input-border)',
          color: 'var(--foreground)',
        }}
      />
      {isOpen && filteredStocks.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md"
          style={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--popover-border)',
            boxShadow: 'var(--popover-shadow)',
          }}
        >
          {filteredStocks.map((stock, index) => (
            <li
              key={stock.code}
              onClick={() => handleSelect(stock)}
              className="px-3 py-2 cursor-pointer text-sm"
              style={{
                backgroundColor:
                  index === highlightIndex
                    ? 'var(--spectrum-orange-400)'
                    : 'transparent',
                color:
                  index === highlightIndex
                    ? '#ffffff'
                    : 'var(--foreground)',
              }}
              onMouseEnter={(e) => {
                if (index !== highlightIndex) {
                  e.currentTarget.style.backgroundColor = 'var(--spectrum-gray-100)'
                }
              }}
              onMouseLeave={(e) => {
                if (index !== highlightIndex) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{stock.code}</span>
                  <span
                    className="text-sm ml-2"
                    style={{
                      color:
                        index === highlightIndex
                          ? 'rgba(255,255,255,0.8)'
                          : 'var(--spectrum-gray-600)',
                    }}
                  >
                    {stock.name}
                  </span>
                </div>
                {stock.board === 'Pengembangan' && (
                  <span
                    className="text-xs px-1.5 py-0.5 border rounded"
                    style={{
                      borderColor:
                        index === highlightIndex
                          ? 'rgba(255,255,255,0.6)'
                          : 'var(--spectrum-green-500)',
                      color:
                        index === highlightIndex
                          ? '#ffffff'
                          : 'var(--spectrum-green-500)',
                    }}
                  >
                    DBX
                  </span>
                )}
                {stock.board === 'Pemantauan Khusus' && (
                  <span className="text-xs">
                    ⚠️
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {isOpen && search && filteredStocks.length === 0 && (
        <div
          className="absolute z-50 w-full mt-1 px-3 py-2 rounded-md text-sm"
          style={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--popover-border)',
            boxShadow: 'var(--popover-shadow)',
            color: 'var(--spectrum-gray-600)',
          }}
        >
          No stocks found
        </div>
      )}
    </div>
  )
}
