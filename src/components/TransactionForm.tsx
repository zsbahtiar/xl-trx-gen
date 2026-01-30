import { StockSearch, type Stock } from "./StockSearch";
import { StockIconUpload } from "./StockIcon";
import type { TransactionData } from "./TransactionCard";

interface TransactionFormProps {
  data: TransactionData;
  onChange: (data: Partial<TransactionData>) => void;
}

const labelClass = "block text-sm font-medium mb-1.5";
const inputClass =
  "w-full px-3 py-2 text-sm border rounded-md transition-colors focus:outline-none focus:ring-2";
const readOnlyClass = "w-full px-3 py-2 text-sm border rounded-md";

export function TransactionForm({ data, onChange }: TransactionFormProps) {
  const handleStockSelect = (stock: Stock | null) => {
    if (stock) {
      onChange({
        ticker: stock.code,
        companyName: stock.name,
        board: stock.board,
      });
    } else {
      onChange({
        ticker: "",
        companyName: "",
        board: "Utama",
      });
    }
  };

  const handleNumberChange = (field: keyof TransactionData, value: string) => {
    const num = parseFloat(value) || 0;
    onChange({ [field]: num });
  };

  const handleDateChange = (value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      onChange({ date });
    }
  };

  // Format date for input value
  const dateValue = data.date.toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* Row 1: Type, Ticker, Date */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Type
          </label>
          <select
            value={data.type}
            onChange={(e) =>
              onChange({ type: e.target.value as "BUY" | "SELL" })
            }
            className={inputClass}
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--input-border)",
              color: "var(--foreground)",
            }}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        <div className="col-span-2">
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Ticker
          </label>
          <StockSearch value={data.ticker} onChange={handleStockSelect} />
        </div>

        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Date
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => handleDateChange(e.target.value)}
            className={inputClass}
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--input-border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {/* Row 2: Company Name, Icon */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Company Name
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Select a ticker above"
            className={inputClass}
            style={{
              backgroundColor: "var(--spectrum-gray-100)",
              borderColor: "var(--input-border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Icon
          </label>
          <StockIconUpload
            ticker={data.ticker || "XX"}
            customIcon={data.iconUrl}
            onUpload={(url) => onChange({ iconUrl: url })}
          />
        </div>
      </div>

      {/* Row 3: Price, Lot Done, Amount */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Price
          </label>
          <input
            type="number"
            value={data.price || ""}
            onChange={(e) => handleNumberChange("price", e.target.value)}
            placeholder="0"
            min="0"
            className={inputClass}
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--input-border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Lot Done
          </label>
          <input
            type="number"
            value={data.lotDone || ""}
            onChange={(e) => handleNumberChange("lotDone", e.target.value)}
            placeholder="0"
            min="0"
            className={inputClass}
            style={{
              backgroundColor: "var(--input)",
              borderColor: "var(--input-border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="col-span-2">
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Amount{" "}
            <span
              style={{ color: "var(--spectrum-gray-500)", fontWeight: 400 }}
            >
              (auto)
            </span>
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("en-US").format(data.amount)}
            readOnly
            className={readOnlyClass}
            style={{
              backgroundColor: "var(--spectrum-gray-200)",
              borderColor: "var(--spectrum-gray-300)",
              color: "var(--spectrum-gray-700)",
            }}
          />
        </div>
      </div>

      {/* Row 4: Total Fee, Net Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Total Fee{" "}
            <span
              style={{ color: "var(--spectrum-gray-500)", fontWeight: 400 }}
            >
              ({data.type === "SELL" ? "0.35%" : "0.15%"})
            </span>
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("en-US").format(data.totalFee)}
            readOnly
            className={readOnlyClass}
            style={{
              backgroundColor: "var(--spectrum-gray-200)",
              borderColor: "var(--spectrum-gray-300)",
              color: "var(--spectrum-gray-700)",
            }}
          />
        </div>

        <div>
          <label
            className={labelClass}
            style={{ color: "var(--spectrum-gray-800)" }}
          >
            Net Amount{" "}
            <span
              style={{ color: "var(--spectrum-gray-500)", fontWeight: 400 }}
            >
              (auto)
            </span>
          </label>
          <input
            type="text"
            value={new Intl.NumberFormat("en-US").format(data.netAmount)}
            readOnly
            className={readOnlyClass}
            style={{
              backgroundColor: "var(--spectrum-gray-200)",
              borderColor: "var(--spectrum-gray-300)",
              color: "var(--spectrum-gray-700)",
            }}
          />
        </div>
      </div>

      {/* Row 5: Buy Price, Realized Gain, Gain % (SELL only) */}
      {data.type === "SELL" && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              className={labelClass}
              style={{ color: "var(--spectrum-gray-800)" }}
            >
              Buy Price
            </label>
            <input
              type="number"
              value={data.buyPrice || ""}
              onChange={(e) =>
                handleNumberChange("buyPrice", e.target.value)
              }
              placeholder="0"
              min="0"
              className={inputClass}
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--input-border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div>
            <label
              className={labelClass}
              style={{ color: "var(--spectrum-gray-800)" }}
            >
              Realized Gain{" "}
              <span
                style={{ color: "var(--spectrum-gray-500)", fontWeight: 400 }}
              >
                (auto)
              </span>
            </label>
            <input
              type="text"
              value={new Intl.NumberFormat("en-US").format(data.realizedGain)}
              readOnly
              className={readOnlyClass}
              style={{
                backgroundColor: "var(--spectrum-gray-200)",
                borderColor: "var(--spectrum-gray-300)",
                color: data.realizedGain >= 0 ? "var(--spectrum-green-500)" : "var(--spectrum-red-500)",
              }}
            />
          </div>

          <div>
            <label
              className={labelClass}
              style={{ color: "var(--spectrum-gray-800)" }}
            >
              Gain %{" "}
              <span
                style={{ color: "var(--spectrum-gray-500)", fontWeight: 400 }}
              >
                (auto)
              </span>
            </label>
            <input
              type="text"
              value={`${data.realizedGainPercent >= 0 ? "+" : ""}${data.realizedGainPercent.toFixed(2)}%`}
              readOnly
              className={readOnlyClass}
              style={{
                backgroundColor: "var(--spectrum-gray-200)",
                borderColor: "var(--spectrum-gray-300)",
                color: data.realizedGainPercent >= 0 ? "var(--spectrum-green-500)" : "var(--spectrum-red-500)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
