export default function QuotationFooter({ quotation }) {
  const subtotal = Number(quotation?.subtotal) || 0;
  const tax = Number(quotation?.tax) || 0;
  const discount = Number(quotation?.discount) || 0;
  const total = Number(quotation?.total) || 0;

  const formatCurrency = (value) =>
    ` ${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="mt-8 flex justify-between items-start gap-8">
      {/* Left */}
      <div className="max-w-[360px] space-y-5 text-[13px]">
        {/* <div>
          <p className="mb-1 font-semibold text-gray-800">Payment Method:</p>
          <p className="text-gray-700">
            {quotation?.payment_mode || "Advance  / Cash / Periodical"}
          </p>
        </div> */}

        <div>
          <p className="mb-1 font-semibold text-gray-800">Terms & Conditions:</p>
          <p className="leading-6 text-gray-700">
            Goods supplied upon payment. Kindly verify items at delivery.
            Delayed payments may affect future orders.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="w-[320px] text-[13px]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              Discount
              {discount > 0
                ? ` (${quotation?.discount_type === "percentage" ? "%" : "PKR"})`
                : ""}
              :
            </span>
            <span className="text-gray-900">
              {discount > 0 ? `- ${formatCurrency(discount)}` : formatCurrency(0)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              Tax
              {tax > 0
                ? ` (${quotation?.tax_type === "percentage" ? "%" : "PKR"})`
                : ""}
              :
            </span>
            <span className="text-gray-900">{formatCurrency(tax)}</span>
          </div>
        </div>

        <div className="mt-3 bg-[#0a4da2] px-4 py-3 text-white">
          <div className="flex items-center justify-between font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}