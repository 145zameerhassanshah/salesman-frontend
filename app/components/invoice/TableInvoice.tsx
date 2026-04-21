export default function TableInvoice({ items = [] }) {
  const totalQuantity = items.reduce((acc, item) => {
    return acc + (Number(item?.quantity) || 0);
  }, 0);

  return (
    <div className="overflow-hidden border border-gray-300 bg-white">
      <table className="w-full border-collapse text-[13px]">
        {/* Header */}
        <thead>
          <tr className="bg-[#0a4da2] text-white">
            <th className="w-[60px] border border-gray-300 px-3 py-2 text-left font-semibold">
              No
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Product
            </th>
            <th className="w-[90px] border border-gray-300 px-3 py-2 text-right font-semibold">
              Qty
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="border border-gray-300 px-3 py-6 text-center text-gray-400"
              >
                No items found
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const qty = Number(item?.quantity) || 0;

              return (
                <tr key={item?._id || index} className="align-middle">
                  {/* No */}
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {/* Product */}
                  <td className="border border-gray-300 px-3 py-2 text-gray-800">
                    <div className="flex items-center gap-2">
                      {item.product_id!=null?
                        <img
                          src={item?.product_id?.image}
                          alt="product"
                          className="h-6 w-6 object-contain"
                        />:<></>}
                      <span className="leading-tight">
                        {item?.item_name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Qty */}
                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-800">
                    {qty}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

        {/* Footer */}
        {items.length > 0 && (
          <tfoot>
            <tr className="bg-[#0a4da2] text-white">
              <td
                colSpan={2}
                className="border border-gray-300 px-3 py-2 text-right font-semibold"
              >
                Total Quantity:
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right font-bold">
                {totalQuantity}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}