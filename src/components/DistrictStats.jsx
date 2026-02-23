import {
  Building2,
  AlertTriangle,
  Flame,
  AlertCircle,
  ClipboardList,
  Shield,
} from "lucide-react";

const DistrictStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel h-full p-6 text-orange-600 dark:text-orange-400">
        Loading…
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-panel flex h-full items-center justify-center text-orange-600 dark:text-orange-400">
        Pick a district to see details
      </div>
    );
  }

  const totals = stats.category_totals || {};
  const items = [
    { label: "Mazar", value: totals.mazar ?? 0, icon: Building2 },
    { label: "Mosque", value: totals.mosque ?? 0, icon: Building2 },
    { label: "Illegal occupation", value: totals.illegal_occupation ?? 0, icon: AlertTriangle },
    { label: "M hotspot", value: totals.m_hotspot ?? 0, icon: Flame },
    { label: "Conversion hotspot", value: totals.conversion_hotspot ?? 0, icon: AlertCircle },
    { label: "Total submissions", value: stats.total_submissions ?? "—", icon: ClipboardList },
    { label: "Police action taken", value: stats.total_police_action_taken ?? "—", icon: Shield },
  ];

  return (
    <div className="glass-panel p-6">
      <h4 className="font-display text-base font-semibold text-orange-900 dark:text-orange-200">
        District Metrics
      </h4>
      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm text-orange-700 dark:text-orange-100"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                <span>{item.label}</span>
              </div>
              <span className="font-semibold text-orange-900 dark:text-orange-200">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DistrictStats;
