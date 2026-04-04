export default function InvoiceFooter({ order }) {
  return (
    <div className="mt-6 flex justify-between items-start gap-6">

      {/* Left */}
      <div className="space-y-4 max-w-sm text-sm">
<div>
  <p className="font-semibold mb-1">Payment Mode</p>
  <p className="text-gray-500 text-xs capitalize">
    {order?.payment_term || "-"}
  </p>
</div>
      </div>

      {/* ✅ Right Card (FIXED DESIGN) */}
            <div className="space-y-4 max-w-sm text-sm">
        <div>
          <p className="font-semibold mb-1">Terms & Conditions</p>
          <p className="text-gray-500 text-xs leading-snug">
            Goods supplied upon payment. Kindly verify items at delivery.
            Delayed payments may affect future orders.
          </p>
        </div>
      </div>


    </div>
  );
}