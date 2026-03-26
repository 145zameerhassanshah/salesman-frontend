import { Pencil } from "lucide-react";

export default function StaffTable({
  data,
  onEdit,
}: {
  data: any[];
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Joined</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">
                <img
                  src={item.image}
                  className="w-10 h-10 rounded-full"
                />
              </td>

              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.email}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="p-3">{item.joined}</td>

              <td className="p-3">
                <button onClick={() => onEdit(item)}>
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}