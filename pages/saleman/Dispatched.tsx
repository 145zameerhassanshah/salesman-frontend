import { Check, X, Eye } from "lucide-react";

export default function Dispatched() {

  const data = [1,2,3,4];

  return (
    <div className="bg-white/60 backdrop-blur rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Dispatched Orders</h3>

        <button className="bg-black text-white text-sm px-4 py-2 rounded-lg">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2 text-left">Invoice #</th>
              <th className="text-left">Client</th>
              <th className="text-left">Date</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((_, i) => (
              <tr key={i} className="border-b last:border-none">

                <td className="py-3">#INV-3387</td>

                <td className="flex items-center gap-2 py-3">
                  <img
                    src="/profile.png"
                    className="w-6 h-6 rounded-full"
                  />
                  Jon Doe
                </td>

                <td>24/2/2026</td>

                <td className="flex gap-2 py-3">

                  <button className="bg-green-100 p-2 rounded-lg">
                    <Check size={14}/>
                  </button>

                  <button className="bg-red-100 p-2 rounded-lg">
                    <X size={14}/>
                  </button>

                  <button className="bg-gray-200 p-2 rounded-lg">
                    <Eye size={14}/>
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}