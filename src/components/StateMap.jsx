import { memo, useMemo, useState } from "react";
import { geoMercator } from "d3-geo";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Skeleton from "./Skeleton";
import { COLORS } from "../lib/colors";

const getDistrictCode = (geo) =>
  geo.properties?.dt_code ||
  geo.properties?.DT_CODE ||
  geo.properties?.dtCode ||
  geo.properties?.DT_CODE_1 ||
  null;

const getDistrictName = (geo) =>
  geo.properties?.district ||
  geo.properties?.dist_nm ||
  geo.properties?.DISTRICT ||
  geo.properties?.name ||
  "Unknown";

const StateMap = memo(function StateMap({
  geography,
  loading,
  selectedDistrict,
  onSelect,
}) {
  if (loading) {
    return <Skeleton className="h-[360px] w-full" />;
  }

  if (!geography) {
    return (
      <div className="glass-panel flex h-[360px] items-center justify-center text-muted">
        District map not available
      </div>
    );
  }

  const projection = useMemo(() => {
    if (!geography) return geoMercator();
    return geoMercator().fitSize([760, 360], geography);
  }, [geography]);

  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  return (
    <div className="glass-panel relative p-4">
      <div className="absolute left-4 top-4 rounded-full bg-secondary/90 px-3 py-1 text-xs text-secondary shadow-soft">
        {hoveredDistrict ? `Hover: ${hoveredDistrict}` : "Hover a district"}
      </div>
      <ComposableMap
        projection={projection}
        width={760}
        height={360}
        className="h-[360px] w-full"
      >
        <Geographies geography={geography}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = getDistrictCode(geo) || getDistrictName(geo);
              const name = getDistrictName(geo);
              const isActive = selectedDistrict === code;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onSelect(code)}
                  onMouseEnter={() => setHoveredDistrict(name)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  style={{
                    default: {
                      fill: isActive ? COLORS.map.selected : COLORS.map.default,
                      outline: "none",
                      stroke: COLORS.map.stroke.default,
                      strokeWidth: 0.6,
                    },
                    hover: {
                      fill: COLORS.map.hover,
                      outline: "none",
                      stroke: COLORS.map.stroke.hover,
                      strokeWidth: 0.7,
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: COLORS.map.pressed,
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

export default StateMap;
