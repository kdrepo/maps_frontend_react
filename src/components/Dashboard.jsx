import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Globe, Moon, Sun, LogIn, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import DistrictPills from "./DistrictPills";
import DistrictStats from "./DistrictStats";
import DistrictTable from "./DistrictTable";
import IndiaMap from "./IndiaMap";
import StateMap from "./StateMap";
import StateStatsPanel from "./StateStatsPanel";
import LoginModal from "./LoginModal";
import ProfileDropdown from "./ProfileDropdown";
import { useIndiaGeo, useStateGeo } from "../hooks/useGeoJson";
import { useDistrictIndex } from "../hooks/useDistrictIndex";
import { useDistrictSummary } from "../hooks/useDistrictSummary";
import { useDistrictRecords } from "../hooks/useDistrictRecords";
import { useStateSummary } from "../hooks/useStateSummary";
import { useIndiaSummary } from "../hooks/useIndiaSummary";
import { useAuth } from "../hooks/useAuth";
import { mockStates } from "../data/mockData";
import MapOnly from "../MapOnly";
import { useMemo, useEffect } from "react";

const mapVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -120 },
};

const Dashboard = ({ darkMode, setDarkMode, user, loading, error, login, logout, isLoginOpen, setIsLoginOpen }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [recordsPageUrl, setRecordsPageUrl] = useState(null);
  const { data: indiaGeo, loading: indiaLoading } = useIndiaGeo();
  const { data: stateGeo, loading: stateLoading } = useStateGeo(selectedState);
  const { data: districtIndex } = useDistrictIndex();

  const selectedStateCode = useMemo(() => {
    if (!selectedState || !districtIndex?.states) return null;
    return districtIndex.states[selectedState]?.code || null;
  }, [selectedState, districtIndex]);

  const stateData = useMemo(() => {
    if (!selectedState) return null;
    const found = mockStates.find((state) => state.id === selectedState);
    if (found) return { ...found, code: selectedStateCode };
    return {
      id: selectedState,
      name: selectedState,
      code: selectedStateCode,
      totalIncidents: "—",
      verifiedLocations: "—",
      videosUploaded: "—",
      policeActionsTaken: "—",
      lastUpdated: "—",
    };
  }, [selectedState, selectedStateCode]);

  const districtList = useMemo(() => {
    if (!selectedState || !districtIndex?.states) return [];
    return districtIndex.states[selectedState]?.districts || [];
  }, [selectedState, districtIndex]);

  const selectedDistrictName = useMemo(() => {
    if (!selectedDistrict) return null;
    const found = districtList.find((d) => d.code === selectedDistrict);
    return found ? found.name : null;
  }, [selectedDistrict, districtList]);

  const { data: districtSummary, loading: summaryLoading } =
    useDistrictSummary(selectedDistrict);
  const { data: stateSummary, loading: stateSummaryLoading } =
    useStateSummary(selectedStateCode);
  const {
    data: districtRecordsResponse,
    loading: recordsLoading,
    pagination,
  } = useDistrictRecords(selectedDistrict, recordsPageUrl);

  const districtRecords = useMemo(
    () => districtRecordsResponse?.results || [],
    [districtRecordsResponse]
  );

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict(null);
    setRecordsPageUrl(null);
  };

  const handleDistrictSelect = (districtCode) => {
    setSelectedDistrict(districtCode);
    setRecordsPageUrl(null);
  };

  const { data: indiaSummary, loading: indiaSummaryLoading } =
    useIndiaSummary();

  if (window.location.pathname === "/map-only") {
    return <MapOnly />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 pb-16 text-orange-900 dark:from-orange-950 dark:via-slate-900 dark:to-slate-800 dark:text-orange-100">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pt-12">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
          <Globe className="h-4 w-4" />
          Stop Land Jihad
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="flex items-center gap-3 font-display text-3xl font-semibold text-orange-900 md:text-4xl dark:text-orange-200">
              {/* <Globe className="h-9 w-9" /> */}
              Bharat Land Jihad Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-orange-800 md:text-base dark:text-orange-100">
              Interactive state and district drill-down with live-ready data
              panels of Land Jihad in India that is silently taking us to our graves.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* <div className="glass-panel flex items-center gap-3 px-4 py-3 text-sm text-orange-700 dark:text-orange-300">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              live data
            </div> */}
            {user && (
              <Link
                to="/duplicates/"
                className="inline-flex items-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100 dark:border-orange-600 dark:text-orange-200 dark:hover:bg-orange-900/30"
              >
                <Copy className="h-4 w-4" />
                Near You
              </Link>
            )}
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition hover:border-orange-400 hover:text-orange-900 dark:border-orange-600 dark:text-orange-200 dark:hover:border-orange-500"
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark mode
                </>
              )}
            </button>
            {user ? (
              <ProfileDropdown user={user} onLogout={logout} loading={loading} />
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 dark:border-orange-600 dark:bg-orange-700 dark:hover:bg-orange-600"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto mt-10 flex max-w-6xl flex-col gap-8 px-6">
        <section className="grid gap-6">
          <AnimatePresence mode="wait">
            {!selectedState ? (
              <motion.div
                key="india-view"
                variants={mapVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="grid gap-6"
              >
                <div className="glass-panel p-6">
                  <h2 className="font-display text-xl font-semibold text-orange-900 dark:text-orange-200">
                    Click a state to drill down
                  </h2>
                  <p className="mt-2 text-sm text-orange-700 dark:text-orange-100">
                    Hover and select a region to reveal district insights.
                  </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <IndiaMap
                    geography={indiaGeo}
                    loading={indiaLoading}
                    onSelect={handleStateSelect}
                  />
                  <StateStatsPanel
                    state={{ name: "India" }}
                    summary={indiaSummary}
                    loading={indiaSummaryLoading}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="state-view"
                variants={mapVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="grid gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold text-orange-900 dark:text-orange-200">
                    {selectedState} Overview
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedState(null);
                      setSelectedDistrict(null);
                    }}
                    className="rounded-full border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition hover:border-orange-400 hover:text-orange-900 dark:border-orange-600 dark:text-orange-200 dark:hover:border-orange-500"
                  >
                    Back to India map
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <StateMap
                    geography={stateGeo}
                    loading={stateLoading}
                    selectedDistrict={selectedDistrict}
                    onSelect={handleDistrictSelect}
                  />
                  <StateStatsPanel
                    state={stateData}
                    summary={stateSummary}
                    loading={stateSummaryLoading}
                  />
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-orange-900 dark:text-orange-200">
                    Districts
                  </h3>
                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-100">
                    Click a district on the map or choose from the list.
                  </p>
                  <div className="mt-4">
                    <DistrictPills
                      districts={districtList}
                      selectedDistrict={selectedDistrict}
                      onSelect={handleDistrictSelect}
                    />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_3fr]">
                  <DistrictStats stats={districtSummary} loading={summaryLoading} />
                  <DistrictTable
                    records={districtRecords}
                    loading={recordsLoading}
                    pagination={pagination}
                    onPageChange={setRecordsPageUrl}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Dashboard;
