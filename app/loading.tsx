import { SkeletonBlock, Spinner } from "@/src/components/feedback/LoadingState";
import { T } from "@/src/config/theme.js";

export default function AppLoading() {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 16px",
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.mutedLight }}>
        <Spinner />
        Loading...
      </div>
      <SkeletonBlock height={48} radius={14} />
      <SkeletonBlock height={220} radius={18} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <SkeletonBlock height={150} radius={16} />
        <SkeletonBlock height={150} radius={16} />
        <SkeletonBlock height={150} radius={16} />
      </div>
    </div>
  );
}
