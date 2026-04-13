import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  Icon: LucideIcon;
}

export default function StatsCard({ title, value, Icon }: Props) {
  return (
    <div className="bg-white/60 rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col gap-3 shadow-sm font-sans">

      <div className="flex items-center gap-2 text-gray-600">
        <Icon size={18} />
        <span className="text-xs sm:text-sm">{title}</span>
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
        {value}
      </h2>

    </div>
  );
}