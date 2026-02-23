import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../lib/api";

export const useDistrictSummary = (districtCode) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!districtCode) {
      setData(null);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchJson(`/api/districts/${districtCode}/summary/`);
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [districtCode]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};
