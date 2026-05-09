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
  const discountValue = Number(item?.discount_percent) || 0;
  const discountType = item?.discount_type || "percentage";
  const qty = Number(item?.quantity) || 0;

  const gross = price * qty;

  const discountAmount =
    discountType === "fixed"
      ? discountValue
      : (gross * discountValue) / 100;

  const calculatedTotal = Math.max(gross - discountAmount, 0);

  const finalTotal =
    item?.total !== undefined && item?.total !== null
      ? Number(item.total)
      : calculatedTotal;

  const formatNumber = (value) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const discountLabel =
    discountValue > 0
      ? discountType === "fixed"
        ? ` ${formatNumber(discountValue)}`
        : `${discountValue}%`
      : "-";

  return (
    <tr key={item?._id || index}>
      <td className="border border-gray-300 px-3 py-2 text-gray-700">
        {String(index + 1).padStart(2, "0")}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-gray-800">
        {item?.item_name || "N/A"}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
        {formatNumber(price)}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
        <div>{discountLabel}
          
        </div>
        {discountAmount > 0 && (
          <div className="text-[10px] text-gray-500">
          </div>
        )}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
        {qty}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-900">
        {formatNumber(finalTotal)}
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