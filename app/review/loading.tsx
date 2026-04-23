import { SkeletonBlock, Spinner } from "@/src/components/feedback/LoadingState";
import { T } from "@/src/config/theme.js";

export default function ReviewLoading() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px",
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.mutedLight }}>
        <Spinner />
        Loading review queue...
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 }}>
        <SkeletonBlock height={480} radius={20} />
        <SkeletonBlock height={480} radius={20} />
        <SkeletonBlock height={480} radius={20} />
      </div>
    </div>
  );
}
