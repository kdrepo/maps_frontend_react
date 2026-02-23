import { useMemo } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useIndiaGeo } from "./hooks/useGeoJson";

const MapOnly = () => {
  const { data: indiaGeo, loading, error } = useIndiaGeo();

  const projection = useMemo(() => {
    if (!indiaGeo) return geoMercator();
    return geoMercator()
      .center([82.5, 22.5])
      .scale(950)
      .translate([450, 300]);
  }, [indiaGeo]);

  const path = useMemo(() => geoPath(projection), [projection]);

  if (loading) return <div>Loading map...</div>;
  if (!indiaGeo)
    return <div>Map data not available. {error ? String(error) : ""}</div>;

  return (
    <div>
      <h1>India Map (Debug)</h1>
      <svg
        width={900}
        height={600}
        viewBox="0 0 900 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {indiaGeo.features.map((feature, index) => (
          <path
            key={feature.id ?? index}
            d={path(feature)}
            fill="none"
            stroke="#000"
            strokeWidth="0.6"
          />
        ))}
      </svg>
    </div>
  );
};

export default MapOnly;
