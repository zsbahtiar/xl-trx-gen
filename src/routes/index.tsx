import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import {
  TransactionCard,
  type TransactionData,
} from "@/components/TransactionCard";
import { TransactionForm } from "@/components/TransactionForm";

export const Route = createFileRoute("/")({ component: App });

// Default: SELL APEX at 123, bought at 118, 60 lots
// Amount = 123 × 60 × 100 = 738,000
// Fee (0.35%) = 2,583
// Net = 738,000 - 2,583 = 735,417
// Realized Gain = (123 - 118) × 60 × 100 = 30,000
// Gain % = (123 - 118) / 118 × 100 = 4.24%
const defaultData: TransactionData = {
  type: "SELL",
  ticker: "APEX",
  companyName: "Apexindo Pratama Duta Tbk",
  board: "Pengembangan",
  date: new Date("2025-10-01"),
  price: 123,
  lotDone: 60,
  amount: 738000,
  totalFee: 2583,
  netAmount: 735417,
  buyPrice: 118,
  realizedGain: 30000,
  realizedGainPercent: 4.24,
  iconUrl: null,
};

function App() {
  const [data, setData] = useState<TransactionData>(defaultData);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((partial: Partial<TransactionData>) => {
    setData((prev) => {
      const updated = { ...prev, ...partial };

      // Auto-calculate Amount
      if ("price" in partial || "lotDone" in partial) {
        updated.amount = updated.price * updated.lotDone * 100;
      }

      // Auto-calculate Total Fee (Stockbit rates)
      // BUY: 0.15%, SELL: 0.25% + 0.1% PPh = 0.35%
      if ("price" in partial || "lotDone" in partial || "type" in partial) {
        const feeRate = updated.type === "SELL" ? 0.0035 : 0.0015;
        updated.totalFee = Math.round(updated.amount * feeRate);
      }

      // Auto-calculate Net Amount
      if (updated.type === "SELL") {
        updated.netAmount = updated.amount - updated.totalFee;
      } else {
        updated.netAmount = updated.amount + updated.totalFee;
      }

      // Auto-calculate Realized Gain for SELL
      if (updated.type === "SELL" && updated.buyPrice > 0) {
        // Realized Gain = (Sell Price - Buy Price) × Lot × 100
        updated.realizedGain = (updated.price - updated.buyPrice) * updated.lotDone * 100;
        // Gain % = ((Sell Price - Buy Price) / Buy Price) × 100
        updated.realizedGainPercent = ((updated.price - updated.buyPrice) / updated.buyPrice) * 100;
      }

      return updated;
    });
  }, []);

  const handleExport = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const pngDataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `${data.type}-${data.ticker}-${data.date.toISOString().split("T")[0]}.png`;
      link.href = pngDataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Form */}
      <div className="lg:w-1/2 bg-white min-h-screen">
        <div className="max-w-lg mx-auto px-6 py-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-foreground">
              Stockbit Card Generator
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--spectrum-gray-600)" }}>
              Generate transaction card images for learning
            </p>
          </div>

          {/* Form */}
          <TransactionForm data={data} onChange={handleChange} />

          {/* Disclaimer */}
          <div className="mt-10 pt-6 border-t" style={{ borderColor: "var(--spectrum-gray-200)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--spectrum-gray-500)" }}>
              <strong>[ID]</strong> Tool ini dibuat untuk pembelajaran pribadi (belajar CSS, TanStack, dan image generator).
              Dilarang menggunakan hasil tool ini untuk penipuan atau aktivitas ilegal lainnya.
            </p>
            <p className="text-xs leading-relaxed mt-2" style={{ color: "var(--spectrum-gray-500)" }}>
              <strong>[EN]</strong> This tool was created for personal learning (CSS, TanStack, and image generator).
              Using this tool for fraud or other illegal activities is prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div
        className="lg:w-1/2 flex-shrink-0 border-l"
        style={{
          backgroundColor: "var(--spectrum-gray-100)",
          borderColor: "var(--spectrum-gray-200)"
        }}
      >
        <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col p-6 lg:p-8">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-foreground">
              Preview
            </h2>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--primary)" }}
              onMouseEnter={(e) => {
                if (!isExporting)
                  e.currentTarget.style.backgroundColor = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
              }}
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Downloading..." : "Download"}
            </button>
          </div>

          {/* Card Preview - Centered */}
          <div className="flex-1 flex items-center justify-center">
            <TransactionCard ref={cardRef} data={data} />
          </div>

          {/* Footer */}
          <p className="text-center text-xs pt-4" style={{ color: "var(--spectrum-gray-500)" }}>
            Made by{" "}
            <a
              href="https://github.com/zsbahtiar"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)" }}
              className="hover:underline"
            >
              zsbahtiar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
