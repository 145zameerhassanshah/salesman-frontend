export default function AuditLog() {

  const data = [1,2,3,4];

  return (
    <div className="bg-white/60 backdrop-blur rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">System Audit Log</h3>

        <button className="bg-black text-white text-sm px-4 py-2 rounded-lg">
          View All Activity
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Timestamp</th>
              <th className="text-left">User</th>
              <th className="text-left">Action</th>
              <th className="text-left">IP Address</th>
            </tr>
          </thead>

          <tbody>
            {data.map((_, i) => (
              <tr key={i} className="border-b last:border-none">

                <td className="py-3">14:23:22 / 2026-2-13</td>

                <td className="flex items-center gap-2 py-3">
                  <img src="/profile.png" className="w-6 h-6 rounded-full"/>
                  Admin
                </td>

                <td>Updated Order #13849</td>

                <td>192.168.1.144</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}