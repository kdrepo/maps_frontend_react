import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../lib/api";

const getPageFromUrl = (url) => {
  if (!url) return 1;
  try {
    const parsed = new URL(url);
    const page = parsed.searchParams.get("page");
    return page ? Number(page) : 1;
  } catch {
    return 1;
  }
};

export const useDistrictRecords = (districtCode, pageUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(null);

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
        const url = pageUrl || `/api/districts/${districtCode}/records/`;
        const json = await fetchJson(url);
        if (active) {
          setData(json);
          if (!pageSize && json?.results?.length) {
            setPageSize(json.results.length);
          }
        }
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
  }, [districtCode, pageUrl, pageSize]);

  const pagination = useMemo(() => {
    const count = data?.count ?? 0;
    const currentPage = getPageFromUrl(pageUrl);
    const totalPages = pageSize ? Math.ceil(count / pageSize) : null;
    return {
      count,
      next: data?.next || null,
      previous: data?.previous || null,
      currentPage,
      totalPages,
    };
  }, [data, pageUrl, pageSize]);

  return useMemo(
    () => ({ data, loading, error, pagination }),
    [data, loading, error, pagination]
  );
};
