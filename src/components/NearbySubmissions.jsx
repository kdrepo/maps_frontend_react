import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, MapPin, Loader, AlertCircle, CheckCircle, Clock, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiCall } from "../lib/api";

const NearbySubmissions = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate("/");
    return null;
  }

  const handleCaptureLocation = () => {
    setLocationError(null);
    setError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy: geoAccuracy } = position.coords;

        setLocation({
          latitude,
          longitude,
        });
        setAccuracy(geoAccuracy);

        console.log(
          `[NEARBY] Location captured: ${latitude}, ${longitude} (±${geoAccuracy}m)`
        );

        // Fetch nearby submissions
        await fetchNearbySubmissions(latitude, longitude);
      },
      (err) => {
        setLocationError(`Failed to get location: ${err.message}`);
        setIsLoading(false);
        console.error("[NEARBY] Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fetchNearbySubmissions = async (latitude, longitude) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiCall("/api/submissions/nearby/", {
        method: "POST",
        body: JSON.stringify({
          client_lat: latitude,
          client_lng: longitude,
        }),
      });

      setSubmissions(data || []);
      console.log("[NEARBY] Found submissions:", data);
    } catch (err) {
      setError(err.message);
      console.error("[NEARBY] Error fetching submissions:", err);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      gps_missing:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      mazar: "Mazar",
      mosque: "Mosque",
      illegal_occupation: "Illegal Occupation",
      m_hotspot: "M-Hotspot",
      conversion_hotspot: "Conversion Hotspot",
    };
    return labels[category] || category;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-950 dark:via-slate-900 dark:to-slate-800 pt-6">
        <div className="mx-auto max-w-3xl px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded-lg bg-orange-200 dark:bg-orange-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 pb-16 text-orange-900 dark:from-orange-950 dark:via-slate-900 dark:to-slate-800 dark:text-orange-100">
      <header className="mx-auto flex max-w-3xl items-center gap-4 px-6 pt-12">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/30"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-orange-900 dark:text-orange-200">
          Check Danger Near You
        </h1>
      </header>

      <main className="mx-auto mt-8 max-w-3xl px-6 space-y-6">
        {/* Location Capture Card */}
        <div className="glass-panel rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-200 mb-2">
                <MapPin className="h-5 w-5" />
                Capture Your Location
              </h2>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Allow access to your location to find submissions within 250 meters.
              </p>
            </div>

            {location && (
              <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                <p className="text-sm text-orange-900 dark:text-orange-100">
                  <span className="font-semibold">Current Location:</span>{" "}
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                {accuracy && (
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Accuracy: ±{accuracy.toFixed(1)}m
                  </p>
                )}
              </div>
            )}

            {locationError && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {locationError}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={handleCaptureLocation}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-medium text-white transition hover:bg-orange-700 disabled:opacity-50 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Capture Location & Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Submissions List */}
        {submissions && submissions.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-4">
              Found {submissions.length} Submission{submissions.length !== 1 ? "s" : ""} Nearby
            </h2>

            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-lg border border-orange-200 p-4 transition hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900/20"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Category Badge */}
                      <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                        {getCategoryLabel(submission.category)}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(
                          submission.status || "pending"
                        )}`}
                      >
                        {getStatusIcon(submission.status || "pending")}
                        {(submission.status || "pending").replace("_", " ")}
                      </span>

                      {/* Location Info */}
                      <div className="mt-3 space-y-1 text-sm text-orange-700 dark:text-orange-300">
                        <p>
                          <span className="font-semibold">Location:</span>{" "}
                          {submission.client_lat.toFixed(6)}, {submission.client_lng.toFixed(6)}
                        </p>
                        <p>
                          <span className="font-semibold">Distance:</span>{" "}
                          {submission.distance_m?.toFixed(1) || "—"}m away
                        </p>
                        <p>
                          <span className="font-semibold">Submitted:</span>{" "}
                          {formatDate(submission.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Submission ID */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                        ID
                      </p>
                      <p className="text-lg font-bold text-orange-900 dark:text-orange-200">
                        #{submission.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!location && !isLoading && (
          <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50/50 p-12 text-center dark:border-orange-800 dark:bg-orange-900/10">
            <MapPin className="mx-auto h-12 w-12 text-orange-400 dark:text-orange-600 mb-3" />
            <p className="text-orange-700 dark:text-orange-300">
              Click the button above to capture your location and find nearby submissions.
            </p>
          </div>
        )}

        {/* No Results State */}
        {location && submissions.length === 0 && !isLoading && !error && (
          <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50/50 p-12 text-center dark:border-orange-800 dark:bg-orange-900/10">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <p className="text-orange-700 dark:text-orange-300">
              No submissions found within 250 meters of your location.
            </p>
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              Click the button above to search from a different location.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NearbySubmissions;
