export default function TableInvoice({ items = [] }) {

  console.log("TABLE ITEMS:", items);

  // ✅ Total Quantity Calculation
  const totalQuantity = items.reduce((acc, item) => {
    return acc + (Number(item?.quantity) || 0);
  }, 0);

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      
      <table className="w-full text-xs">

        {/* Header */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="py-2 px-3 text-left text-gray-500 w-[40px]">No.</th>
            <th className="px-3 text-left text-gray-500">Product</th>
            <th className="px-3 text-right text-gray-500 w-[60px]">Qnty.</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-400">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const qty = Number(item?.quantity) || 0;

              return (
                <tr
                  key={item?._id || index}
                  className="border-b last:border-none"
                >
                  {/* No */}
                  <td className="py-2 px-3 text-gray-500">
                    {index + 1}
                  </td>

                  {/* Product */}
                  <td className="px-3">
                    <div className="flex items-center gap-2">

                      <img
                        src={
                          item.product_id?.image
                            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.product_id.image}`
                            : "/images/default-product.png"
                        }
                        alt="product"
                        className="w-8 h-8 object-contain bg-gray-100 rounded-md p-1"
                      />

                      <span className="text-gray-700 leading-tight">
                        {item?.item_name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-3 text-right text-gray-700">
                    {qty}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

        {/* ✅ Footer (Total Quantity) */}
        {items.length > 0 && (
          <tfoot>
            <tr className="bg-gray-50 border-t">
              <td colSpan={2} className="py-2 px-3 text-right font-semibold text-gray-700">
                Total Quantity:
              </td>
              <td className="py-2 px-3 text-right font-bold text-gray-900">
                {totalQuantity}
              </td>
            </tr>
          </tfoot>
        )}

      </table>
    </div>
  );
}