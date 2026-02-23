import { memo, useMemo, useState } from "react";
import { geoArea, geoMercator } from "d3-geo";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Skeleton from "./Skeleton";

const getStateName = (geo) =>
  geo.properties?.STNAME ||
  geo.properties?.st_nm ||
  geo.properties?.STATE_NAME ||
  geo.properties?.state_name ||
  geo.properties?.name ||
  "Unknown";

const IndiaMap = memo(function IndiaMap({
  geography,
  loading,
  selectedState,
  onSelect,
}) {
  const [hovered, setHovered] = useState(null);

  if (loading) {
    return <Skeleton />;
  }

  if (!geography) {
    return (
      <div className="flex items-center justify-center h-full">
        Map data not available
      </div>
    );
  }

  // No filtering - keep all states
  const cleanedGeo = useMemo(() => {
    if (!geography) return null;
    return geography;
  }, [geography]);

  // Projection that covers all of India including islands
  // Bounding box: Longitude 68.09 to 97.39, Latitude 6.77 to 37.07
  const projection = useMemo(() => {
    return geoMercator()
      .center([82.5, 22.5]) // Center point
      .scale(1000)          // Zoom level - increase to zoom in, decrease to zoom out
      .translate([410, 300]); // Position on canvas [x, y]
  }, []);

  const featureCount = cleanedGeo?.features?.length ?? 0;

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded shadow text-sm z-10 font-medium">
        {featureCount} states loaded
      </div>
      <div className="absolute top-2 right-2 bg-white/90 px-3 py-1.5 rounded shadow text-sm z-10">
        {hovered ? (
          <span className="font-medium text-blue-600">{hovered}</span>
        ) : (
          <span className="text-gray-500">Hover a state</span>
        )}
      </div>

      <ComposableMap
        projection={projection}
        width={820}
        height={600}
        className="w-full h-full"
      >
        <Geographies geography={cleanedGeo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = getStateName(geo);
              const isActive = selectedState === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect(name)}
                  style={{
                    default: {
                      fill: isActive ? "#1e3a8a" : "#e2e8f0",
                      outline: "none",
                      stroke: "#0f172a",
                      strokeWidth: 0.5,
                      strokeLinejoin: "round",
                      strokeLinecap: "round",
                    },
                    hover: {
                      fill: "#2563eb",
                      outline: "none",
                      stroke: "#0f172a",
                      strokeWidth: 0.8,
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#0f766e",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
});

export default IndiaMap;
