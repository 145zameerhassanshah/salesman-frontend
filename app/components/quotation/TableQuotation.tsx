export default function TableQuotation({ items = [] }) {
  return (
    <div className="overflow-hidden border border-gray-300 bg-white">
      <table className="w-full border-collapse text-[13px]">
        {/* Header */}
        <thead>
          <tr className="bg-[#0a4da2] text-white">
            <th className="w-[55px] border border-gray-300 px-3 py-2 text-left font-semibold">
              No
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Product / Service Description
            </th>
            <th className="w-[100px] border border-gray-300 px-3 py-2 text-right font-semibold">
              Price
            </th>
            <th className="w-[80px] border border-gray-300 px-3 py-2 text-right font-semibold">
              Disc.
            </th>
            <th className="w-[70px] border border-gray-300 px-3 py-2 text-right font-semibold">
              Qty
            </th>
            <th className="w-[120px] border border-gray-300 px-3 py-2 text-right font-semibold">
              Total
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="border border-gray-300 px-3 py-6 text-center text-gray-400">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const price = Number(item?.unit_price) || 0;
              const discPercent = Number(item?.discount_percent) || 0;
              const qty = Number(item?.quantity) || 0;

              const gross = price * qty;
              const discountAmount = (gross * discPercent) / 100;
              const calculatedTotal = gross - discountAmount;

              const finalTotal =
                item?.total !== undefined && item?.total !== null
                  ? Number(item.total)
                  : calculatedTotal;

              return (
                <tr key={item?._id || index}>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-gray-800">
                    {item?.item_name || "N/A"}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                    {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                    {discPercent}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                    {qty}
                  </td>

                  <td className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900">
                    {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}