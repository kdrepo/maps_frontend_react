import { useState } from "react";
import {
  MapPin,
  Image as ImageIcon,
  Link as LinkIcon,
  Inbox,
  MapIcon,
  Shield,
  CheckCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";
import { absolutizeMediaUrl } from "../lib/api";

const DistrictTable = ({ records, loading, pagination, onPageChange }) => {
  const [expandedCells, setExpandedCells] = useState(new Set());

  const toggleCell = (key) => {
    setExpandedCells((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderCellText = (value, key, maxWidthClass = "max-w-[160px]") => {
    const text = value ?? "";
    if (text === "") return <span className="text-xs text-orange-400 dark:text-orange-600">—</span>;
    const isLong = String(text).length > 8;
    const expanded = expandedCells.has(key);
    if (!isLong) return text;
    return (
      <span
        onClick={() => toggleCell(key)}
        className={`block ${maxWidthClass} cursor-pointer ${
          expanded ? "whitespace-normal break-words" : "ellipsis-cell"
        }`}
        title={expanded ? "" : String(text)}
      >
        {String(text)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <Skeleton className="h-8 w-1/2" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="glass-panel p-6">
        <EmptyState
          title="No records found"
          description="Select a different district or update the data feed."
        />
      </div>
    );
  }

  const policeYes = (row) =>
    !!row.police_action_type ||
    !!row.forwarded_to_police ||
    !!row.illegality_established;

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed text-left text-sm text-secondary">
          <colgroup>
            <col className="w-[240px]" />
            <col className="w-[120px]" />
            <col className="w-[140px]" />
            <col className="w-[120px]" />
            <col className="w-[140px]" />
            <col className="w-[120px]" />
            <col className="w-[160px]" />
            <col className="w-[160px]" />
            <col className="w-[180px]" />
          </colgroup>
          <thead className="bg-tertiary text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Image</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>Video Link</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  <span>Category</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  <span>Google Map</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Police Action</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Police Action Type</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Forwarded To Police</span>
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Illegality Established</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const hasPolice = policeYes(record);
              return (
                <tr
                  key={record.id}
                  className="border-t border-primary text-secondary"
                >
                  <td className="px-6 py-4 font-medium text-primary">
                    {renderCellText(
                      record.location,
                      `${record.id}-location`,
                      "max-w-[220px]"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {record.compressed_photo ? (
                      <img
                        src={absolutizeMediaUrl(record.compressed_photo)}
                        alt={record.location}
                        className="h-12 w-16 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xs text-orange-400 dark:text-orange-600">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {record.video ? (
                      <a
                        href={absolutizeMediaUrl(record.video)}
                        className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View video
                      </a>
                    ) : (
                      <span className="text-xs text-orange-400 dark:text-orange-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {renderCellText(
                      record.category,
                      `${record.id}-category`,
                      "max-w-[120px]"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {record.client_lat && record.client_lng ? (
                      <a
                        href={`https://www.google.com/maps?q=${record.client_lat},${record.client_lng}`}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
                        target="_blank"
                        rel="noreferrer"
                        title={`${record.client_lat}, ${record.client_lng}`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        View Map
                      </a>
                    ) : (
                      <span className="text-xs text-orange-400 dark:text-orange-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        hasPolice
                          ? "bg-orange-200 text-orange-900 dark:bg-orange-900/40 dark:text-orange-300"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                      }`}
                    >
                      {hasPolice ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {renderCellText(
                      record.police_action_type,
                      `${record.id}-pat`,
                      "max-w-[160px]"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {renderCellText(
                      record.forwarded_to_police ?? "",
                      `${record.id}-ftp`,
                      "max-w-[140px]"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {renderCellText(
                      record.illegality_established ?? "",
                      `${record.id}-ie`,
                      "max-w-[160px]"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-200 dark:border-orange-900 px-6 py-4 text-sm text-orange-700 dark:text-orange-100">
          <div>
            {pagination.count} records
            {pagination.totalPages
              ? ` · Page ${pagination.currentPage} of ${pagination.totalPages}`
              : ` · Page ${pagination.currentPage}`}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPageChange?.(pagination.previous)}
              disabled={!pagination.previous}
              className="rounded-full border border-orange-300 dark:border-orange-700 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-200 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => onPageChange?.(pagination.next)}
              disabled={!pagination.next}
              className="rounded-full border border-orange-300 dark:border-orange-700 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictTable;
