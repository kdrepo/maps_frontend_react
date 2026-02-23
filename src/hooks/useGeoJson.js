import { useEffect, useMemo, useState } from "react";
import { indiaFallback, stateFallback } from "../data/geojsonFallback";

const normalizeGeo = (geo) => (geo && geo.features ? geo : null);

export const useIndiaGeo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/geojson/india_states.geojson");
        if (!res.ok) throw new Error("India GeoJSON not found");
        const json = await res.json();
        if (active) setData(normalizeGeo(json));
      } catch (err) {
        if (active) {
          setError(err);
          setData(indiaFallback);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};

export const useStateGeo = (stateId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toSlug = (name) =>
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");

  const specialMap = {
    "dadra and nagar haveli and daman and diu": "dnh-and-dd",
  };

  useEffect(() => {
    if (!stateId) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const key = stateId.toLowerCase();
        const file =
          specialMap[key] || toSlug(stateId);
        const res = await fetch(`/geojson/states/${file}.geojson`);
        if (!res.ok) throw new Error("State GeoJSON not found");
        const json = await res.json();
        if (active) setData(normalizeGeo(json));
      } catch (err) {
        if (active) {
          setError(err);
          setData(stateFallback[stateId] || null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [stateId]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};
