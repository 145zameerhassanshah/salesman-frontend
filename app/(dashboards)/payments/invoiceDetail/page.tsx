"use client";

export default function InvoiceDetail() {
  const payments = [
    { id: 1, date: "20/02/2026", method: "Wire Transfer", paid: 50, total: 50, balance: 200 },
    { id: 2, date: "22/02/2026", method: "Cash", paid: 25, total: 75, balance: 175 },
    { id: 3, date: "23/02/2026", method: "Bank Transfer", paid: 30, total: 105, balance: 145 },
    { id: 4, date: "24/02/2026", method: "Wire Transfer", paid: 20, total: 125, balance: 125 },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <p className="text-sm text-gray-500">Payments</p>
        <h1 className="text-2xl md:text-3xl font-semibold">#INV-3387</h1>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white/60 rounded-3xl p-4 md:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">

        <div>
          <p className="text-gray-500 text-xs">Client</p>
          <p className="font-medium">John Doe</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Status</p>
          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">
            Partial
          </span>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Total Amount</p>
          <p>$250.00</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Paid</p>
          <p>$125.00</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Balance</p>
          <p>$125.00</p>
        </div>

      </div>

      {/* PAYMENT HISTORY */}
      <div className="bg-white/60 rounded-3xl p-4 md:p-6">

        <h2 className="font-medium mb-4">Payment History</h2>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-2">No.</th>
                <th className="text-left">Date</th>
                <th className="text-left">Method</th>
                <th className="text-left">Paid</th>
                <th className="text-left">Total Paid</th>
                <th className="text-left">Balance</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-none">
                  <td className="py-3">{p.id}</td>
                  <td>{p.date}</td>
                  <td>{p.method}</td>

                  <td className="text-green-600">${p.paid}</td>
                  <td>${p.total}</td>
                  <td className="text-red-500">${p.balance}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm text-sm">

              <div className="flex justify-between">
                <p className="font-medium">#{p.id}</p>
                <p className="text-gray-500">{p.date}</p>
              </div>

              <p className="text-gray-500 text-xs mt-1">{p.method}</p>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-gray-400">Paid</p>
                  <p className="text-green-600">${p.paid}</p>
                </div>

                <div>
                  <p className="text-gray-400">Total</p>
                  <p>${p.total}</p>
                </div>

                <div>
                  <p className="text-gray-400">Balance</p>
                  <p className="text-red-500">${p.balance}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}