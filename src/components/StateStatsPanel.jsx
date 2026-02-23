import {
  Building2,
  AlertTriangle,
  Flame,
  AlertCircle,
  ClipboardList,
  Shield,
  MapPin,
  Eye,
  Video,
  Clock,
} from "lucide-react";

const StateStatsPanel = ({ state, summary, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel flex h-full items-center justify-center text-orange-600 dark:text-orange-400">
        Loading…
      </div>
    );
  }

  if (!state && !summary) {
    return (
      <div className="glass-panel flex h-full items-center justify-center text-orange-600 dark:text-orange-400">
        Select a state to view stats
      </div>
    );
  }

  const totals = summary?.category_totals || {};
  const items = summary
    ? [
        { label: "Mazar", value: totals.mazar ?? 0, icon: Building2 },
        { label: "Mosque", value: totals.mosque ?? 0, icon: Building2 },
        { label: "Illegal occupation", value: totals.illegal_occupation ?? 0, icon: AlertTriangle },
        { label: "M hotspot", value: totals.m_hotspot ?? 0, icon: Flame },
        { label: "Conversion hotspot", value: totals.conversion_hotspot ?? 0, icon: AlertCircle },
        { label: "Total submissions", value: summary.total_submissions ?? "—", icon: ClipboardList },
        {
          label: "Total police action taken",
          value: summary.total_police_action_taken ?? "—",
          icon: Shield,
        },
      ]
    : [
        { label: "Total incidents", value: state.totalIncidents, icon: MapPin },
        { label: "Verified locations", value: state.verifiedLocations, icon: Eye },
        { label: "Videos uploaded", value: state.videosUploaded, icon: Video },
        { label: "Police actions taken", value: state.policeActionsTaken, icon: Shield },
        { label: "Last updated", value: state.lastUpdated, icon: Clock },
      ];

  return (
    <div className="glass-panel h-full p-6">
      <h3 className="font-display text-lg font-semibold text-primary">
        {summary?.state_name || state?.name} Overview
      </h3>
      <div className="mt-4 space-y-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm text-orange-700 dark:text-orange-100">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                  <span>{item.label}</span>
                </div>
                <span className="text-base font-semibold text-orange-900 dark:text-orange-200">
                  {item.value}
                </span>
              </div>
              {index !== items.length - 1 && (
                <div className="mt-2 h-px bg-orange-200 dark:bg-orange-900" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StateStatsPanel;
