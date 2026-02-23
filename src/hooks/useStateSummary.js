import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../lib/api";

export const useStateSummary = (stateCode) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stateCode) {
      setData(null);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchJson(`/api/states/${stateCode}/summary/`);
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
  }, [stateCode]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};
