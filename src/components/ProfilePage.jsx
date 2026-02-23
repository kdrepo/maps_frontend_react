import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, Mail, Phone, User as UserIcon, Calendar, Award, CheckCircle, FileText, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiCall } from "../lib/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only redirect if we've finished loading AND there's no user
    if (!loading && !user) {
      navigate("/");
      return;
    }

    // If we don't have a user yet but are still loading, wait
    if (loading) {
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only fetch profile if we have a user and aren't loading auth
    if (loading || !user) {
      return;
    }

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const data = await apiCall("/api/profile/", {
          method: "GET",
        });
        setProfile(data);
        console.log("[PROFILE] Profile data loaded:", data);
      } catch (err) {
        setError(err.message);
        console.error("[PROFILE] Error fetching profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, loading]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-950 dark:via-slate-900 dark:to-slate-800 pt-6">
        <div className="mx-auto max-w-3xl px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded-lg bg-orange-200 dark:bg-orange-800" />
            <div className="h-64 rounded-lg bg-orange-100 dark:bg-orange-900/30" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const userData = profile.user;
  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      moderator: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      power_user: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      user: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return colors[role] || "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  };

  const getLevelColor = (level) => {
    if (level.includes("0")) return "text-gray-600 dark:text-gray-400";
    if (level.includes("1")) return "text-green-600 dark:text-green-400";
    if (level.includes("2")) return "text-blue-600 dark:text-blue-400";
    if (level.includes("3")) return "text-purple-600 dark:text-purple-400";
    return "text-orange-600 dark:text-orange-400";
  };

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
          My Profile
        </h1>
      </header>

      <main className="mx-auto mt-8 max-w-3xl px-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-5xl font-bold text-white">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold text-orange-900 dark:text-orange-200">
                  {userData.name || userData.username}
                </h2>
                {userData.is_phone_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                @{userData.username}
              </p>

              {/* Badges Row */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize ${getRoleColor(userData.role)}`}>
                  <Zap className="h-3 w-3" />
                  {userData.role.replace("_", " ")}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium ${getLevelColor(userData.level)} dark:bg-orange-900/30`}>
                  <Award className="h-3 w-3" />
                  {userData.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-200 mb-4">
            <UserIcon className="h-5 w-5" />
            Contact Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="break-all text-orange-900 dark:text-orange-100">
                {userData.email || "Not provided"}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-2">
                <Phone className="h-4 w-4" />
                Phone
              </label>
              <div className="flex items-center gap-2">
                <p className="text-orange-900 dark:text-orange-100">
                  {userData.phone || "Not provided"}
                </p>
                {userData.is_phone_verified && (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-2">
                <UserIcon className="h-4 w-4" />
                Username
              </label>
              <p className="text-orange-900 dark:text-orange-100">
                {userData.username}
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-2 block">
                Role
              </label>
              <p className="capitalize text-orange-900 dark:text-orange-100">
                {userData.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Contributions & Stats */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-200 mb-4">
            <FileText className="h-5 w-5" />
            Contributions & Stats
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Submissions */}
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                Total Submissions
              </p>
              <p className="mt-2 text-3xl font-bold text-orange-900 dark:text-orange-200">
                {userData.total_submissions}
              </p>
            </div>

            {/* Level */}
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                Current Level
              </p>
              <p className={`mt-2 text-2xl font-bold ${getLevelColor(userData.level)}`}>
                {userData.level}
              </p>
            </div>

            {/* Verification */}
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                Verification Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                {userData.is_phone_verified ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Verified
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        {profile.submissions && profile.submissions.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-200 mb-4">
              <FileText className="h-5 w-5" />
              Recent Submissions
            </h3>

            <div className="space-y-3">
              {profile.submissions.map((submission, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-orange-200 p-4 dark:border-orange-800"
                >
                  <p className="font-medium text-orange-900 dark:text-orange-100">
                    {submission.title || `Submission #${idx + 1}`}
                  </p>
                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                    {submission.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Profile Button */}
        <div className="flex justify-center">
          <button
            className="rounded-full bg-orange-600 px-8 py-3 font-medium text-white transition hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            onClick={() => {
              alert("Edit profile feature coming soon!");
            }}
          >
            Edit Profile
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
