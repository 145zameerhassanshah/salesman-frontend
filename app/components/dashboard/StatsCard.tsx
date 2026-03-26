import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  Icon: LucideIcon;
}

export default function StatsCard({ title, value, Icon }: Props) {
  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl p-6 flex flex-col gap-4 shadow-sm">

      <div className="flex items-center gap-2 text-gray-600">
        <Icon size={18} />
        <span className="text-sm">{title}</span>
      </div>

      <h2 className="text-3xl font-semibold">{value}</h2>

    </div>
  );
}