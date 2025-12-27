import { useEffect, useState } from "react";
import SettingsTabs from "../components/settings/SettingsTabs";
import GeneralSettings from "../components/settings/GeneralSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SettingsSkeleton from "../components/settings/SettingsSkeleton";

export default function SettingsPage() {
  const [tab, setTab] = useState("General");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Settings
      </h2>

      <SettingsTabs active={tab} onChange={setTab} />

      {tab === "General" && <GeneralSettings />}
      {tab === "Notification" && <NotificationSettings />}
    </div>
  );
}
