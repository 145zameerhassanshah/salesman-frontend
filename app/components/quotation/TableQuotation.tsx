export default function TableQuotation({ items = [] }) {

  console.log("TABLE ITEMS:", items); // 🔥 DEBUG

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      
      <table className="w-full text-xs">

        {/* Header */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="py-2 px-3 text-left text-gray-500 w-[40px]">No.</th>
            <th className="px-3 text-left text-gray-500">Product</th>
            <th className="px-3 text-right text-gray-500 w-[80px]">Price</th>
            <th className="px-3 text-right text-gray-500 w-[70px]">Disc.</th>
            <th className="px-3 text-right text-gray-500 w-[60px]">Qnty.</th>
            <th className="px-3 text-right text-gray-500 w-[90px]">Total</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-400">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
              const price = Number(item?.unit_price) || 0;
              const discPercent = Number(item?.discount_percent) || 0;
              const qty = Number(item?.quantity) || 0;

              const discountAmount = (price * discPercent) / 100;
              const finalPrice = price - discountAmount;
              const total = finalPrice * qty;

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

                  {/* Price */}
                  <td className="px-3 text-right text-gray-700">
                    PKR {price.toFixed(2)}
                  </td>

                  {/* Discount */}
                  <td className="px-3 text-right text-gray-700">
                    {discPercent}%
                  </td>

                  {/* Quantity */}
                  <td className="px-3 text-right text-gray-700">
                    {qty}
                  </td>

                  {/* Total */}
                  <td className="px-3 text-right font-medium text-gray-800">
                    PKR {(item?.total ?? total).toFixed(2)}
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