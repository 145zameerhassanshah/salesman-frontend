import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  Icon: LucideIcon;
}

export default function StatsCard({ title, value, Icon }: Props) {
  return (
    <div className="bg-white rounded-xl px-3 py-3 flex items-center justify-between shadow-sm">

      <div>
        <p className="text-[11px] text-gray-500">{title}</p>
        <h2 className="text-lg font-semibold text-gray-800">{value}</h2>
      </div>

      <div className="bg-gray-100 p-2 rounded-lg">
        <Icon size={16} className="text-gray-600" />
      </div>

    </div>
  );
}