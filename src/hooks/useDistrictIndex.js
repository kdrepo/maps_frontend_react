import { useEffect, useMemo, useState } from "react";

export const useDistrictIndex = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/data/district_index.json");
        if (!res.ok) throw new Error("District index not found");
        const json = await res.json();
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
  }, []);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};
