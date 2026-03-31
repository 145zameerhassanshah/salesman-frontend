export default function InvoiceFooter({ order }) {
  return (
    <div className="mt-6 flex justify-between items-start gap-6">

      {/* Left */}
      <div className="space-y-4 max-w-sm text-sm">

        <div>
          <p className="font-semibold mb-1">Payment Mode</p>
          <p className="text-gray-500 text-xs">
            Advance · Account · Cash · Periodical
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1">Terms & Conditions</p>
          <p className="text-gray-500 text-xs leading-snug">
            Goods supplied upon payment. Kindly verify items at delivery.
            Delayed payments may affect future orders.
          </p>
        </div>

      </div>

      {/* Right Box */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 w-[260px] shadow-sm space-y-2 text-sm">

        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{order?.subtotal?.toFixed(2) || "0.00"}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>
            Tax ({order?.tax_type === "percent" ? "%" : "PKR"})
          </span>
          <span>{order?.tax?.toFixed(2) || "0.00"}</span>
        </div>

        {order?.discount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>
              Discount ({order?.discount_type === "percent" ? "%" : "PKR"})
            </span>
            <span>- {order?.discount?.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium">Total</span>
          <span className="text-lg font-semibold">
            {order?.total?.toFixed(2) || "0.00"}
          </span>
        </div>

      </div>

    </div>
  );
}