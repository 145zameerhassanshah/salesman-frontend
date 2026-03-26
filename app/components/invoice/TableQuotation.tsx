export default function TableQuotationSimple() {
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: "SS-40L Super Series Electric",
    qty: Math.floor(Math.random() * 8) + 1,
    image: "/product.png",
  }));

  return (
    <div className="border border-gray-200 rounded-xl bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
      
      <table className="w-full text-xs">

        {/* Header */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="py-2 px-3 text-left text-gray-500 w-[40px]">No.</th>
            <th className="px-3 text-left text-gray-500">Product</th>
            <th className="px-3 text-right text-gray-500 w-[80px]">Qty</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {products.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-none hover:bg-gray-50"
            >
              {/* No */}
              <td className="py-2 px-3 text-gray-500">
                {item.id}
              </td>

              {/* Product */}
              <td className="px-3">
                <div className="flex items-center gap-2">
                  
                  <img
                    src={item.image}
                    alt="product"
                    className="w-8 h-8 object-contain bg-white border rounded-md p-1"
                  />

                  <span className="text-gray-700 leading-tight">
                    {item.name}
                  </span>
                </div>
              </td>

              {/* Qty */}
              <td className="px-3 text-right font-medium text-gray-800">
                {item.qty}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}