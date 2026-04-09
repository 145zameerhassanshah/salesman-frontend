"use client";

export default function AddPaymentPage() {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div>
          <p className="text-sm text-gray-500">Payments</p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Add Payment
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
            ✓ Save Payment
          </button>
          <button className="border px-4 py-2 rounded-lg text-sm">
            Save Draft
          </button>
          <button className="border px-4 py-2 rounded-lg text-sm text-red-500">
            Cancel
          </button>
        </div>

      </div>

      {/* ================= SUMMARY ================= */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-5 gap-6 text-sm">

          <div>
            <p className="text-gray-500 text-xs">Invoice Number</p>
            <p className="font-medium">#INV-3387</p>
          </div>

          <div className="flex items-center gap-2">
            <img src="/profile.png" className="w-7 h-7 rounded-full" />
            <div>
              <p className="text-gray-500 text-xs">Client</p>
              <p className="font-medium">John Doe</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Total Amount</p>
            <p>$250.00</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Paid to Date</p>
            <p>$125.00</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Current Balance</p>
            <p className="font-medium">$125.00</p>
          </div>

        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-3 text-xs">

          <div>
            <p className="text-gray-400">Invoice</p>
            <p className="font-medium">#INV-3387</p>
          </div>

          <div>
            <p className="text-gray-400">Client</p>
            <p className="font-medium">John Doe</p>
          </div>

          <div>
            <p className="text-gray-400">Total</p>
            <p>$250.00</p>
          </div>

          <div>
            <p className="text-gray-400">Paid</p>
            <p>$125.00</p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-400">Balance</p>
            <p className="font-semibold text-red-500">$125.00</p>
          </div>

        </div>

      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6 space-y-5">

        <h2 className="font-medium">Payment Details</h2>

        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-xs text-gray-500">Payment Amount</label>
            <input
              type="text"
              defaultValue="$125"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Payment Method</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none">
              <option>Wire Transfer</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>

        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-xs text-gray-500">Payment Date</label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Reference Number</label>
            <input
              type="text"
              placeholder="e.g. TXN-12345"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
            />
          </div>

        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-gray-500">Notes</label>
          <textarea
            rows={3}
            placeholder="Internal notes about payment..."
            className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
          />
        </div>

      </div>

    </div>
  );
}