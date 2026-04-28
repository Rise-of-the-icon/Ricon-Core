"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { T, font } from "../config/theme.js";
import { PORTAL_ITEMS, TALENT } from "../data/siteData.js";
import {
  Badge,
  Btn,
  Icon,
  MiniBar,
  SectionTitle,
  Stat,
  TalentAvatar,
} from "../components/ui.jsx";
import RevisionDiffView from "../components/RevisionDiffView";

export default function TalentPortal({ section, nav, viewport }) {
  const talent = TALENT[0];
  const portalSection = section || "talent-dash";
  const { isMobile, isTablet } = viewport;
  const portalSurface = `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`;
  const [reviewStatus, setReviewStatus] = useState("talent_review");
  const [reviewMessage, setReviewMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [moduleDecisions, setModuleDecisions] = useState({});
  const [settingsFeedback, setSettingsFeedback] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    moduleVisibility: {
      biography: true,
      careerTimeline: true,
      careerStatistics: true,
      personalStory: true,
      brandIdentity: false,
      mediaAppearances: true,
    },
    dataSharing: {
      allowFanApps: true,
      allowLicensePartners: true,
      allowAiTrainingPartners: false,
      includeSensitiveHistory: false,
    },
    delegateAccess: {
      managerEmail: "",
      legalRepEmail: "",
      approvalsRequired: true,
    },
    notifications: {
      reviewEmail: true,
      reviewSms: false,
      reviewAlerts: true,
      earningsReports: true,
    },
  });
  const settingsStorageKey = useMemo(() => `ricon:talent-settings:${talent.slug}`, [talent.slug]);
  const checkboxStyle = { width: 20, height: 20, accentColor: T.cyan, flexShrink: 0 };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(settingsStorageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      setSettingsForm((previous) => ({
        ...previous,
        ...parsed,
        moduleVisibility: { ...previous.moduleVisibility, ...(parsed?.moduleVisibility ?? {}) },
        dataSharing: { ...previous.dataSharing, ...(parsed?.dataSharing ?? {}) },
        delegateAccess: { ...previous.delegateAccess, ...(parsed?.delegateAccess ?? {}) },
        notifications: { ...previous.notifications, ...(parsed?.notifications ?? {}) },
      }));
    } catch {
      // Ignore corrupted local values and keep defaults.
    }
  }, [settingsStorageKey]);

  function setNestedToggle(sectionKey, fieldKey, checked) {
    setSettingsFeedback("");
    setSettingsForm((previous) => ({
      ...previous,
      [sectionKey]: {
        ...previous[sectionKey],
        [fieldKey]: checked,
      },
    }));
  }

  function setDelegateValue(fieldKey, value) {
    setSettingsFeedback("");
    setSettingsForm((previous) => ({
      ...previous,
      delegateAccess: {
        ...previous.delegateAccess,
        [fieldKey]: value,
      },
    }));
  }

  function saveSettings() {
    try {
      window.localStorage.setItem(settingsStorageKey, JSON.stringify(settingsForm));
      setSettingsFeedback("Saved successfully");
    } catch {
      setSettingsFeedback("Unable to save settings.");
    }
  }

  function saveModuleDecision(fieldId, decision) {
    startTransition(async () => {
      const response = await fetch("/api/talent/review/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: talent.slug,
          fieldId,
          decision,
        }),
      });
      const payload = await response.json();

      if (!response.ok || payload.error) {
        setReviewMessage(payload.error ?? "Unable to save this decision.");
        return;
      }

      setModuleDecisions((previous) => ({ ...previous, [fieldId]: decision }));
      setReviewMessage(
        decision === "accepted"
          ? "Change accepted and saved to the talent review audit context."
          : "Change rejected and saved for editorial follow-up.",
      );
    });
  }

  const talentReviewDiffs = [
    {
      id: "biography",
      title: "Biography",
      oldText: "Jason Kidd is a former NBA point guard known for elite playmaking and leadership.",
      newText:
        "Jason Kidd is a former NBA point guard, Hall of Famer, and championship-winning coach known for elite playmaking and leadership.",
      oldSource: {
        publicationName: "Team Media Guide",
        url: "https://example.com/media-guide",
        dateAccessed: "2026-03-02",
      },
      newSource: {
        publicationName: "NBA Hall of Fame Profile",
        url: "https://example.com/hof-profile",
        dateAccessed: "2026-04-10",
      },
    },
    {
      id: "career-timeline",
      title: "Career Timeline",
      oldText: "2020: Assistant coach with Lakers.",
      newText: "2020: Assistant coach with Lakers.\n2021: Named head coach of Dallas Mavericks.",
      oldSource: {
        publicationName: "ESPN Coach Tracker",
        url: "https://example.com/coach-tracker",
        dateAccessed: "2026-03-02",
      },
      newSource: {
        publicationName: "Dallas Mavericks Press Release",
        url: "https://example.com/mavs-release",
        dateAccessed: "2026-04-10",
      },
    },
  ];

  function submitTalentAction(action, comment = null) {
    startTransition(async () => {
      setReviewMessage("");
      const response = await fetch("/api/talent/review/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          comment,
          profileId: talent.slug,
        }),
      });
      const payload = await response.json();

      if (!response.ok || payload.error) {
        setReviewMessage(payload.error ?? "Unable to update talent review.");
        return;
      }

      setReviewStatus(action === "talent_approve" ? "talent_approved" : "needs_revision");
      setReviewMessage(
        action === "talent_approve"
          ? "Profile approved. The editorial team can now publish it."
          : "Changes requested. The profile has been moved to Needs Revision.",
      );
    });
  }

  const renderContent = () => {
    switch (portalSection) {
      case "talent-dash":
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap", padding: isMobile ? 16 : 24, background: portalSurface, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm }}>
              <TalentAvatar talent={talent} size={64} radius={16} />
              <div>
                <h1 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, fontFamily: font.display, color: T.paper, margin: 0, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                  Welcome back, Jason
                </h1>
                <div style={{ fontSize: 13, color: T.muted, fontFamily: font.body }}>
                  Last sign-in: Mar 15, 2026 · All modules verified
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 140 : 180}px, 1fr))`, gap: 16, marginBottom: 32 }}>
              {[
                { label: "Profile Completeness", value: "100%", color: T.cyan, icon: "verified" },
                { label: "Active Modules", value: "8", color: T.orange, icon: "shield" },
                { label: "Total Earnings", value: "$42,800", color: T.green, icon: "chart" },
                { label: "Pending Reviews", value: "2", color: T.gold, icon: "bell" },
              ].map((item) => (
                <div key={item.label} style={{ padding: isMobile ? "14px 16px" : "16px 24px", background: portalSurface, borderRadius: T.radius, border: `1px solid ${T.border}`, boxShadow: T.shadowSm, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Icon name={item.icon} size={16} color={item.color} />
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: font.body, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, fontFamily: font.display, color: item.color }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <SectionTitle sub="Items requiring your attention.">Notifications</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { title: "New media asset ready for review", desc: "Official portrait usage note submitted by the editorial team", time: "2h ago", color: T.orange },
                { title: "Module update: Career Timeline", desc: "Operations team added 2024-25 coaching record. Needs your sign-off.", time: "1 day ago", color: T.cyan },
                { title: "Earnings report available", desc: "February 2026 revenue summary ready to view", time: "3 days ago", color: T.green },
              ].map((notification) => (
                <div key={notification.title} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: isMobile ? "14px 16px" : "16px 24px", background: portalSurface, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, borderLeft: `4px solid ${notification.color}`, flexWrap: isMobile ? "wrap" : "nowrap", boxShadow: T.shadowSm, minWidth: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: notification.color, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.paper, fontFamily: font.body, marginBottom: 2 }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, fontFamily: font.body, overflowWrap: "anywhere" }}>{notification.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, color: T.muted, fontFamily: font.body, flexShrink: 0, marginLeft: isMobile ? 22 : 0, width: isMobile ? "100%" : "auto" }}>
                    {notification.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "talent-review":
        return (
          <div>
            <SectionTitle sub="Review and approve content modules about your life and career.">
              Content Review
            </SectionTitle>
            {reviewMessage ? (
              <div role="status" aria-live="polite" style={{ padding: "14px 16px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: reviewStatus === "talent_approved" ? T.greenDim : T.orangeDim, color: T.paper, marginBottom: 14, fontSize: 13 }}>
                {reviewMessage}
              </div>
            ) : null}
            <div style={{ display: "grid", gap: 10 }}>
              {talentReviewDiffs.map((diffItem) => (
                <RevisionDiffView
                  key={diffItem.id}
                  title={diffItem.title}
                  oldText={diffItem.oldText}
                  newText={diffItem.newText}
                  oldSource={diffItem.oldSource}
                  newSource={diffItem.newSource}
                  decisionStatus={moduleDecisions[diffItem.id] ?? "pending"}
                  onAccept={() => saveModuleDecision(diffItem.id, "accepted")}
                  onReject={() => saveModuleDecision(diffItem.id, "rejected")}
                />
              ))}
            </div>
            <div style={{ marginTop: 10, marginBottom: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {talentReviewDiffs.map((diffItem) => (
                <Badge
                  key={`${diffItem.id}-status`}
                  color={
                    moduleDecisions[diffItem.id] === "accepted"
                      ? T.green
                      : moduleDecisions[diffItem.id] === "rejected"
                        ? T.orange
                        : T.gold
                  }
                >
                  {diffItem.title}:{" "}
                  {moduleDecisions[diffItem.id] === "accepted"
                    ? "Accepted"
                    : moduleDecisions[diffItem.id] === "rejected"
                      ? "Rejected"
                      : "Pending"}
                </Badge>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <Btn onClick={() => submitTalentAction("talent_approve")} disabled={isPending || reviewStatus === "talent_approved"}>
                Approve Profile
              </Btn>
              <Btn variant="secondary" onClick={() => submitTalentAction("talent_request_changes", "Talent requested content changes.")} disabled={isPending || reviewStatus === "talent_approved"}>
                Request Changes
              </Btn>
            </div>
          </div>
        );

      case "talent-earnings":
        return (
          <div>
            <SectionTitle sub="Revenue generated from verified data licensing and partner access.">
              Earnings
            </SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 160 : 200}px, 1fr))`, gap: 16, marginBottom: 32 }}>
              <Stat label="Total Earnings" value="$42,800" color={T.green} sub="+18% from last month" />
              <Stat label="This Month" value="$6,340" color={T.cyan} sub="Mar 2026" />
              <Stat label="Partner Access" value="$28,400" color={T.orange} sub="67% of total" />
              <Stat label="Data Licensing" value="$14,400" color={T.violet} sub="33% of total" />
            </div>

            <div style={{ background: portalSurface, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: isMobile ? 16 : 24, boxShadow: T.shadowSm }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: font.body, color: T.paper, margin: "0 0 16px" }}>
                Revenue by Module
              </h3>
              {[
                { module: "Biography", amount: "$14,980", pct: 35, color: T.cyan },
                { module: "Career Stats", amount: "$11,984", pct: 28, color: T.violet },
                { module: "Brand Identity", amount: "$8,560", pct: 20, color: T.orange },
                { module: "Media", amount: "$4,708", pct: 11, color: T.green },
                { module: "Personal Story", amount: "$2,568", pct: 6, color: T.pink },
              ].map((item) => (
                <div key={item.module} style={{ display: "flex", alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: isMobile ? "100%" : 100, fontSize: 13, fontWeight: 600, color: T.paper, fontFamily: font.body }}>
                    {item.module}
                  </div>
                  <div style={{ flex: 1 }}>
                    <MiniBar value={item.pct} max={35} color={item.color} />
                  </div>
                  <div style={{ width: isMobile ? "auto" : 70, fontSize: 13, fontWeight: 600, color: item.color, fontFamily: font.body, textAlign: "right" }}>
                    {item.amount}
                  </div>
                  <div style={{ width: isMobile ? "auto" : 36, fontSize: 11, color: T.muted, fontFamily: font.body, textAlign: "right" }}>
                    {item.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "talent-settings":
        return (
          <div>
            <SectionTitle sub="Control your privacy, visibility, and data access permissions.">
              Settings & Privacy
            </SectionTitle>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ padding: "16px 24px", background: portalSurface, borderRadius: T.radius, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.paper, marginBottom: 10, fontFamily: font.body }}>Module Visibility</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    ["biography", "Biography"],
                    ["careerTimeline", "Career Timeline"],
                    ["careerStatistics", "Career Statistics"],
                    ["personalStory", "Personal Story"],
                    ["brandIdentity", "Brand Identity"],
                    ["mediaAppearances", "Media Appearances"],
                  ].map(([key, label]) => (
                    <label key={key} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: T.mutedLight, fontSize: 13, gap: 12, minHeight: 44 }}>
                      {label}
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.moduleVisibility[key])}
                        onChange={(event) => setNestedToggle("moduleVisibility", key, event.target.checked)}
                        style={checkboxStyle}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ padding: "16px 24px", background: portalSurface, borderRadius: T.radius, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.paper, marginBottom: 10, fontFamily: font.body }}>Data Sharing Controls</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    ["allowFanApps", "Allow fan app usage"],
                    ["allowLicensePartners", "Allow licensed partner distribution"],
                    ["allowAiTrainingPartners", "Allow approved AI training partners"],
                    ["includeSensitiveHistory", "Include sensitive history modules"],
                  ].map(([key, label]) => (
                    <label key={key} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: T.mutedLight, fontSize: 13, gap: 12, minHeight: 44 }}>
                      {label}
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.dataSharing[key])}
                        onChange={(event) => setNestedToggle("dataSharing", key, event.target.checked)}
                        style={checkboxStyle}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ padding: "16px 24px", background: portalSurface, borderRadius: T.radius, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.paper, marginBottom: 10, fontFamily: font.body }}>Delegate Access</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ color: T.muted, fontSize: 12 }}>Manager Email</span>
                    <input
                      type="email"
                      value={settingsForm.delegateAccess.managerEmail}
                      onChange={(event) => setDelegateValue("managerEmail", event.target.value)}
                      style={{ minHeight: 44, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: T.ink, color: T.paper, padding: "0 10px" }}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ color: T.muted, fontSize: 12 }}>Legal Representative Email</span>
                    <input
                      type="email"
                      value={settingsForm.delegateAccess.legalRepEmail}
                      onChange={(event) => setDelegateValue("legalRepEmail", event.target.value)}
                      style={{ minHeight: 44, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: T.ink, color: T.paper, padding: "0 10px" }}
                    />
                  </label>
                  <label style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: T.mutedLight, fontSize: 13, gap: 12, minHeight: 44 }}>
                    Require dual approvals for publish actions
                    <input
                      type="checkbox"
                      checked={settingsForm.delegateAccess.approvalsRequired}
                      onChange={(event) => setNestedToggle("delegateAccess", "approvalsRequired", event.target.checked)}
                      style={checkboxStyle}
                    />
                  </label>
                </div>
              </div>

              <div style={{ padding: "16px 24px", background: portalSurface, borderRadius: T.radius, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.paper, marginBottom: 10, fontFamily: font.body }}>Notification Preferences</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    ["reviewEmail", "Email me about review actions"],
                    ["reviewSms", "SMS me urgent review requests"],
                    ["reviewAlerts", "Notify me about new review requests"],
                    ["earningsReports", "Send monthly earnings reports"],
                  ].map(([key, label]) => (
                    <label key={key} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: T.mutedLight, fontSize: 13, gap: 12, minHeight: 44 }}>
                      {label}
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.notifications[key])}
                        onChange={(event) => setNestedToggle("notifications", key, event.target.checked)}
                        style={checkboxStyle}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Btn onClick={saveSettings} style={{ minHeight: 46 }}>Save Settings</Btn>
                {settingsFeedback ? (
                  <span style={{ fontSize: 13, color: settingsFeedback === "Saved successfully" ? T.green : T.orange }}>
                    {settingsFeedback}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: isTablet ? "column" : "row", minHeight: "calc(100vh - 64px)", minWidth: 0 }}>
      <aside style={{ width: isTablet ? "100%" : 240, background: `linear-gradient(180deg, ${T.panelStrong}, transparent), ${T.inkLight}`, borderRight: isTablet ? "none" : `1px solid ${T.border}`, borderBottom: isTablet ? `1px solid ${T.border}` : "none", padding: isMobile ? "16px 12px" : "24px 12px", flexShrink: 0, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 24 }}>
          <TalentAvatar talent={talent} size={36} radius={10} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.paper, fontFamily: font.body }}>
              Jason Kidd
            </div>
            <div style={{ fontSize: 10, color: T.cyan, fontFamily: font.body }}>
              Talent Portal
            </div>
          </div>
        </div>
        <nav aria-label="Talent portal sections" style={{ display: isTablet ? "flex" : "block", gap: 8, overflowX: isTablet ? "auto" : "visible", paddingBottom: isTablet ? 4 : 0, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {PORTAL_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-current={portalSection === item.id ? "page" : undefined}
              onClick={() => nav(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: isTablet ? "auto" : "100%", minWidth: isTablet ? "fit-content" : undefined, whiteSpace: isTablet ? "nowrap" : "normal", minHeight: 44, padding: "0 16px", border: portalSection === item.id ? `1px solid ${T.border}` : "1px solid transparent", borderRadius: T.radiusMd, background: portalSection === item.id ? T.panel : "transparent", cursor: "pointer", transition: "all 0.15s", marginBottom: isTablet ? 0 : 8, flexShrink: 0 }}
            >
              <Icon name={item.icon} size={16} color={portalSection === item.id ? T.cyan : T.muted} />
              <span style={{ fontSize: 13, fontWeight: portalSection === item.id ? 600 : 400, color: portalSection === item.id ? T.paper : T.muted, fontFamily: font.body }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div style={{ height: 1, background: T.border, margin: "16px 8px" }} />
        <button type="button" onClick={() => nav("home")} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minHeight: 44, padding: "0 16px", border: `1px solid ${T.borderLight}`, borderRadius: T.radiusMd, background: T.panel, cursor: "pointer" }}>
          <Icon name="external" size={16} color={T.muted} />
          <span style={{ fontSize: 13, color: T.muted, fontFamily: font.body }}>Exit Portal</span>
        </button>
      </aside>
      <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "24px 16px" : isTablet ? "28px 20px" : "32px 36px", overflowY: "auto" }}>
        {renderContent()}
      </div>
    </div>
  );
}
