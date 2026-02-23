// import { memo, useMemo, useState } from "react";
// import { geoMercator, geoPath, geoArea } from "d3-geo";
// import Skeleton from "./Skeleton";

// const getStateName = (geo) =>
//   geo.properties?.STNAME ||
//   geo.properties?.st_nm ||
//   geo.properties?.STATE_NAME ||
//   geo.properties?.state_name ||
//   geo.properties?.name ||
//   "Unknown";

// const IndiaMap = memo(function IndiaMap({ geography, loading, onSelect }) {
//   // ✅ ALL HOOKS FIRST
//   const [hoveredState, setHoveredState] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);

//   const projection = useMemo(() => {
//     return geoMercator()
//       .center([82.5, 22.5])
//       .scale(684)
//       .translate([410, 210]);
//   }, []);

//   const path = useMemo(() => geoPath(projection), [projection]);

//   // Sort by area: largest first (bottom), smallest last (top)
//   const sortedFeatures = useMemo(() => {
//     if (!geography || !geography.features) return [];
    
//     const featuresWithArea = geography.features.map((feature) => ({
//       feature,
//       area: Math.abs(geoArea(feature)),
//       name: getStateName(feature),
//     }));

//     // Sort descending by area
//     return featuresWithArea.sort((a, b) => b.area - a.area);
//   }, [geography]);

//   // Reorder states: hovered state goes to the end (top)
//   const renderOrder = useMemo(() => {
//     if (!hoveredState) return sortedFeatures;
    
//     // Move hovered state to the end so it renders on top
//     const others = sortedFeatures.filter(item => item.name !== hoveredState);
//     const hovered = sortedFeatures.find(item => item.name === hoveredState);
    
//     return hovered ? [...others, hovered] : sortedFeatures;
//   }, [sortedFeatures, hoveredState]);

//   // Early returns AFTER all hooks
//   if (loading) {
//     return <Skeleton className="h-[420px] w-full" />;
//   }

//   if (!geography) {
//     return (
//       <div className="glass-panel flex h-[420px] items-center justify-center text-slate-500">
//         Map data not available
//       </div>
//     );
//   }

//   const handleStateClick = (stateName) => {
//     console.log("Clicked:", stateName);
//     setSelectedState(stateName);
//     if (onSelect) onSelect(stateName);
//   };

//   return (
//     <div className="glass-panel p-4">
//       <svg
//         width={820}
//         height={420}
//         viewBox="0 0 820 420"
//         preserveAspectRatio="xMidYMid meet"
//         className="h-[420px] w-full"
//       >
//         {/* Render states with dynamic order */}
//         {renderOrder.map(({ feature, name, area }, index) => {
//           const isHovered = hoveredState === name;
//           const isSelected = selectedState === name;
//           const pathData = path(feature);

//           if (!pathData) return null;

//           return (
//             <path
//               key={`${name}-${index}`}
//               d={pathData}
//               fill={
//                 isSelected
//                   ? "#1e3a8a" // Dark blue for selected
//                   : isHovered
//                   ? "#2563eb" // Medium blue for hover
//                   : "#e2e8f0" // Light gray default
//               }
//               stroke="#0f172a"
//               strokeWidth={isSelected || isHovered ? 1.2 : 0.7}
//               strokeLinejoin="round"
//               style={{
//                 cursor: "pointer",
//                 transition: "fill 0.15s ease, stroke-width 0.15s ease",
//               }}
//               onMouseEnter={() => setHoveredState(name)}
//               onMouseLeave={() => setHoveredState(null)}
//               onClick={() => handleStateClick(name)}
//             />
//           );
//         })}
//       </svg>

//       {/* State info display */}
//       <div className="mt-2 flex justify-between text-sm">
//         <div>
//           {hoveredState && (
//             <span className="font-medium text-blue-600">
//               Hover: {hoveredState}
//             </span>
//           )}
//         </div>
//         <div>
//           {selectedState && (
//             <span className="font-medium text-slate-900">
//               Selected: {selectedState}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// export default IndiaMap;











import { memo, useMemo, useState, useEffect } from "react";
import { geoMercator, geoPath } from "d3-geo";
import Skeleton from "./Skeleton";
import { COLORS } from "../lib/colors";
import { fetchJson } from "../lib/api";

const getStateName = (geo) =>
  geo.properties?.st_nm ||
  geo.properties?.STNAME ||
  geo.properties?.STATE_NAME ||
  geo.properties?.state_name ||
  geo.properties?.name ||
  "Unknown";

const IndiaMap = memo(function IndiaMap({ geography, loading, onSelect }) {
  // ✅ ALL HOOKS FIRST
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [zoom, setZoom] = useState(1.5);
  const [choropleth, setChoropleth] = useState(null);
  const [choroplethLoading, setChoroplethLoading] = useState(false);

  const projection = useMemo(() => {
    return geoMercator()
      .center([82.5, 22.5])
      .scale(684)
      .translate([410, 210]);
  }, []);

  const path = useMemo(() => geoPath(projection), [projection]);

  // Group districts by state
  const stateGroups = useMemo(() => {
    if (!geography || !geography.features) return new Map();
    
    const groups = new Map();
    
    geography.features.forEach((feature) => {
      const stateName = getStateName(feature);
      
      if (!groups.has(stateName)) {
        groups.set(stateName, []);
      }
      groups.get(stateName).push(feature);
    });
    
    console.log(`Grouped ${geography.features.length} districts into ${groups.size} states`);
    
    return groups;
  }, [geography]);

  // Fetch choropleth API once
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setChoroplethLoading(true);
      try {
        const data = await fetchJson("/api/choropleth/states/");
        if (!mounted) return;

        // Normalize keys to lower-case trimmed form for matching
        const map = {};
        Object.entries(data || {}).forEach(([k, v]) => {
          map[k.trim().toLowerCase()] = v?.total_submissions ?? 0;
        });

        setChoropleth(map);
      } catch (err) {
        console.error("Failed to load choropleth data:", err);
        setChoropleth({});
      } finally {
        if (mounted) setChoroplethLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Determine color for a state using a green palette
  const getStateChoroplethColor = (stateName) => {
    if (!choropleth || Object.keys(choropleth).length === 0) return COLORS.map.default;

    // Build min/max once
    const values = Object.values(choropleth).map((v) => Number(v) || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const key = stateName.trim().toLowerCase();
    const val = Number(choropleth[key] || 0);

    // Palette: light -> dark greens
    const palette = [
      "#e9f7ee",
      "#cfeedd",
      "#a6e1bd",
      "#6fd28f",
      "#33b24f",
      "#1a7f2a",
    ];

    if (max === min) {
      // If all values equal (or zero), pick mid color when non-zero
      return val > 0 ? palette[Math.floor(palette.length / 2)] : COLORS.map.default;
    }

    const norm = Math.max(0, Math.min(1, (val - min) / (max - min)));
    const idx = Math.floor(norm * (palette.length - 1));
    return palette[idx];
  };

  // Early returns AFTER all hooks
  if (loading) {
    return <Skeleton className="h-[420px] w-full" />;
  }

  if (!geography) {
    return (
      <div className="glass-panel flex h-[420px] items-center justify-center text-muted">
        Map data not available
      </div>
    );
  }

  const handleStateClick = (stateName) => {
    console.log("Clicked:", stateName);
    setSelectedState(stateName);
    if (onSelect) onSelect(stateName);
  };

  return (
    <div className="glass-panel p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>India map</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-primary px-3 py-1 text-xs font-medium text-secondary"
            onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))}
          >
            -
          </button>
          <span className="min-w-[48px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="rounded-full border border-primary px-3 py-1 text-xs font-medium text-secondary"
            onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)))}
          >
            +
          </button>
          <button
            type="button"
            className="rounded-full border border-primary px-3 py-1 text-xs font-medium text-secondary"
            onClick={() => setZoom(1)}
          >
            Reset
          </button>
        </div>
      </div>
      <svg
        width={820}
        height={420}
        viewBox="0 0 820 420"
        preserveAspectRatio="xMidYMid meet"
        className="h-[420px] w-full"
      >
        <g transform={`translate(410 210) scale(${zoom}) translate(-410 -210)`}>
          {/* Render each state as a group of its districts */}
          {Array.from(stateGroups.entries()).map(([stateName, districts]) => {
            const isHovered = hoveredState === stateName;
            const isSelected = selectedState === stateName;

            return (
              <g
                key={stateName}
                onMouseEnter={() => setHoveredState(stateName)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(stateName)}
                style={{ cursor: "pointer" }}
              >
                {/* Render all districts of this state */}
                {districts.map((district, idx) => {
                  const pathData = path(district);
                  if (!pathData) return null;

                  return (
                    <path
                      key={`${stateName}-${idx}`}
                      d={pathData}
                      fill={
                        isSelected
                          ? COLORS.map.pressed
                          : isHovered
                          ? COLORS.map.hover
                          : getStateChoroplethColor(stateName)
                      }
                      stroke={COLORS.map.stroke.default}
                      strokeWidth="0.3"
                      style={{
                        transition: "fill 0.15s ease",
                      }}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>

      {/* State info display */}
      <div className="mt-2 flex justify-between text-sm">
        <div>
          {hoveredState && (
            <span className="font-medium text-accent">
              Hover: {hoveredState}
            </span>
          )}
        </div>
        <div>
          {selectedState && (
            <span className="font-medium text-primary">
              Selected: {selectedState}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default IndiaMap;


