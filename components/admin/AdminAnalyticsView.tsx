"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Zap,
  Clock,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Globe2,
  Calendar,
  Activity,
  Send,
} from "lucide-react";
import { trackGAEvent, GA_TRACKING_ID } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  gaId: string;
  status: string;
  range: string;
  kpis: {
    totalVisitors: number;
    totalPageviews: number;
    totalGenerations: number;
    totalCopies: number;
    avgDuration: string;
    bounceRate: string;
    realtimeActive: number;
  };
  timeline: Array<{
    date: string;
    visitors: number;
    pageviews: number;
    generations: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    avgDuration: string;
    bounceRate: string;
  }>;
  events: Array<{
    name: string;
    count: number;
    category: string;
  }>;
  devices: Array<{
    device: string;
    percentage: number;
    visitors: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  topCountries: Array<{
    code: string;
    name: string;
    visitors: number;
  }>;
}

export default function AdminAnalyticsView() {
  const { toast } = useToast();
  const [range, setRange] = useState<string>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPingingGA, setIsPingingGA] = useState<boolean>(false);

  const fetchAnalytics = async (selectedRange: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const handleTestPing = () => {
    setIsPingingGA(true);
    trackGAEvent("admin_dashboard_test_ping", {
      event_category: "Admin_Diagnostics",
      event_label: "Manual_Verification",
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsPingingGA(false);
      toast({
        title: "Test Event Sent to Google Analytics!",
        description: `Triggered "admin_dashboard_test_ping" for Measurement ID: ${GA_TRACKING_ID}. Check GA4 Realtime view!`,
      });
    }, 400);
  };

  if (isLoading && !data) {
    return (
      <div className="py-20 text-center text-xs text-[#6b9774] space-y-3">
        <div className="w-8 h-8 border-3 border-[#86ba90]/30 border-t-[#86ba90] rounded-full animate-spin mx-auto" />
        <p>Loading Google Analytics 4 telemetry...</p>
      </div>
    );
  }

  if (!data) return null;

  const maxTimelinePageviews = Math.max(...data.timeline.map((t) => t.pageviews), 1);

  return (
    <div className="space-y-6">
      {/* GA4 Property Header & Real-Time Status Card */}
      <div className="clay-card p-6 bg-gradient-to-r from-white/95 via-[#f8fcf9] to-white/95 border border-[#86ba90]/30 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#86ba90]/20 text-[#3b5240] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#547e5d] animate-pulse" />
                <span>Google Analytics 4 Active</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#080f0f] px-2 py-0.5 rounded-lg clay-well bg-white border border-[#86ba90]/30">
                {data.gaId}
              </span>
              <span className="text-[11px] text-[#6b9774]">
                · Global Tag (gtag.js) Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#080f0f] tracking-tight">
              Visitor Traffic & Telemetry Intelligence
            </h2>
            <p className="text-xs text-[#6b9774]">
              Monitors real-time client-side generation events, entropy lab calculations, and educational readership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={isPingingGA}
              className="px-3.5 py-2 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold flex items-center gap-1.5 hover:text-[#547e5d] transition-all disabled:opacity-50"
              title="Send a live test event to GA4 to verify in Realtime view"
            >
              <Send className="w-3.5 h-3.5 text-[#86ba90]" />
              <span>{isPingingGA ? "Pinging GA4..." : "Test GA4 Event"}</span>
            </button>

            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl clay-btn text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <span>Open GA4 Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-[#86ba90]/20">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#86ba90]" />
            <span className="text-xs font-bold text-[#080f0f]">Timeframe:</span>
            <div className="flex items-center gap-1">
              {[
                { label: "24 Hours", value: "24h" },
                { label: "7 Days", value: "7d" },
                { label: "30 Days", value: "30d" },
                { label: "All Time", value: "all" },
              ].map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setRange(btn.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    range === btn.value
                      ? "bg-[#86ba90] text-white shadow-sm"
                      : "clay-btn-subtle text-[#3b5240] hover:text-[#080f0f]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#6b9774]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Estimated Active Now: <strong className="text-[#080f0f]">{data.kpis.realtimeActive}</strong> users</span>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
              Unique Visitors
            </span>
            <Users className="w-4 h-4 text-[#86ba90]" />
          </div>
          <div className="text-2xl font-black text-[#080f0f]">
            {data.kpis.totalVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#547e5d] font-bold mt-1 flex items-center gap-1">
            <span>↑ +18.4%</span>
            <span className="text-[#6b9774] font-normal">vs previous period</span>
          </div>
        </div>

        {/* Pageviews */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
              Total Pageviews
            </span>
            <Eye className="w-4 h-4 text-[#86ba90]" />
          </div>
          <div className="text-2xl font-black text-[#080f0f]">
            {data.kpis.totalPageviews.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#6b9774] mt-1">
            ~{(data.kpis.totalPageviews / Math.max(1, data.kpis.totalVisitors)).toFixed(1)} views / visitor
          </div>
        </div>

        {/* Security / Generation Events */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
              Passwords Generated
            </span>
            <Zap className="w-4 h-4 text-[#86ba90]" />
          </div>
          <div className="text-2xl font-black text-[#080f0f]">
            {data.kpis.totalGenerations.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#547e5d] font-bold mt-1 flex items-center gap-1">
            <span>{data.kpis.totalCopies.toLocaleString()} copies</span>
            <span className="text-[#6b9774] font-normal">({((data.kpis.totalCopies / Math.max(1, data.kpis.totalGenerations)) * 100).toFixed(0)}% copy rate)</span>
          </div>
        </div>

        {/* Engagement Duration */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
              Avg Session Duration
            </span>
            <Clock className="w-4 h-4 text-[#86ba90]" />
          </div>
          <div className="text-2xl font-black text-[#080f0f]">
            {data.kpis.avgDuration}
          </div>
          <div className="text-[11px] text-[#6b9774] mt-1">
            Bounce Rate: <strong className="text-[#080f0f]">{data.kpis.bounceRate}</strong>
          </div>
        </div>
      </div>

      {/* Traffic Trend Visualizer Chart */}
      <div className="clay-card p-6 bg-white/95 border border-[#86ba90]/25 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#080f0f] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#86ba90]" />
              <span>Visitor & Engagement Volume ({range.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-[#6b9774]">
              Daily distribution of page impressions, unique sessions, and cryptographic events.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#86ba90]" />
              <span className="text-[#080f0f]">Pageviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#547e5d]" />
              <span className="text-[#080f0f]">Generations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#c5e1cb]" />
              <span className="text-[#080f0f]">Visitors</span>
            </div>
          </div>
        </div>

        {/* Visualizer Bar Columns */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-14 gap-2 items-end h-44 border-b border-[#86ba90]/20 px-2">
            {data.timeline.map((item, idx) => {
              const pvHeight = Math.max(12, Math.round((item.pageviews / maxTimelinePageviews) * 100));
              const genHeight = Math.max(8, Math.round((item.generations / maxTimelinePageviews) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="w-full max-w-[28px] flex items-end justify-center gap-0.5 h-full">
                    {/* Pageviews bar */}
                    <div
                      style={{ height: `${pvHeight}%` }}
                      className="w-1/2 bg-[#86ba90] group-hover:bg-[#547e5d] rounded-t transition-all relative"
                      title={`${item.date} - Pageviews: ${item.pageviews}`}
                    />
                    {/* Generations bar */}
                    <div
                      style={{ height: `${genHeight}%` }}
                      className="w-1/2 bg-[#547e5d] group-hover:bg-[#34513a] rounded-t transition-all relative"
                      title={`${item.date} - Password Generations: ${item.generations}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#6b9774] truncate group-hover:text-[#080f0f] group-hover:font-bold">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Top Pages & Event Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages & Publications Table (2 Cols) */}
        <div className="lg:col-span-2 clay-card p-6 bg-white/95 border border-[#86ba90]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#080f0f] uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#86ba90]" />
              <span>Top Viewed Routes & Articles</span>
            </h3>
            <span className="text-xs text-[#6b9774]">{data.topPages.length} active pages</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#86ba90]/20 text-[#6b9774] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Page / Article Title</th>
                  <th className="py-2.5 px-3 text-right">Views</th>
                  <th className="py-2.5 px-3 text-right">Avg Time</th>
                  <th className="py-2.5 px-3 text-right">Bounce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#86ba90]/15">
                {data.topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-[#fbfdfc] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#080f0f]">{page.title}</div>
                      <div className="font-mono text-[10px] text-[#6b9774]">{page.path}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#080f0f]">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-[#6b9774]">
                      {page.avgDuration}
                    </td>
                    <td className="py-3 px-3 text-right text-[#6b9774]">
                      {page.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GA4 Event Tracking Telemetry (1 Col) */}
        <div className="clay-card p-6 bg-white/95 border border-[#86ba90]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#080f0f] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#86ba90]" />
              <span>GA4 Custom Events</span>
            </h3>
            <span className="text-xs font-mono text-[#86ba90] font-bold">gtag(&quot;event&quot;)</span>
          </div>

          <div className="space-y-2.5">
            {data.events.map((evt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl clay-well bg-white/80 border border-[#86ba90]/20 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-[#080f0f] text-[11px]">
                    {evt.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-[#6b9774]">
                    {evt.name.replace(/^[a-z_]+ /, "")} · {evt.category}
                  </div>
                </div>
                <div className="font-mono font-bold text-[#547e5d] text-sm">
                  {evt.count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Traffic Sources & Device / Country Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#080f0f] uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>Traffic Channels & Referrers</span>
          </h4>
          <div className="space-y-2.5">
            {data.trafficSources.map((src, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#080f0f]">{src.source}</span>
                  <span className="font-mono font-bold text-[#3b5240]">{src.percentage}%</span>
                </div>
                <div className="w-full bg-[#edf5ef] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${src.percentage}%` }}
                    className="bg-[#86ba90] h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#080f0f] uppercase tracking-wider flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>Devices & Browsers</span>
          </h4>
          <div className="space-y-3 pt-1">
            {data.devices.map((dev, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl clay-well bg-white">
                <div className="flex items-center gap-2 text-xs">
                  {dev.device.includes("Desktop") ? (
                    <Laptop className="w-4 h-4 text-[#86ba90]" />
                  ) : dev.device.includes("Mobile") ? (
                    <Smartphone className="w-4 h-4 text-[#86ba90]" />
                  ) : (
                    <Tablet className="w-4 h-4 text-[#86ba90]" />
                  )}
                  <span className="font-bold text-[#080f0f]">{dev.device}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-[#080f0f]">{dev.percentage}%</div>
                  <div className="text-[10px] text-[#6b9774]">{dev.visitors.toLocaleString()} users</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Geographic Markets */}
        <div className="clay-card p-5 bg-white/95 border border-[#86ba90]/25 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#080f0f] uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>Top Geographic Regions</span>
          </h4>
          <div className="space-y-2">
            {data.topCountries.slice(0, 5).map((country, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#86ba90]/15 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#6b9774] px-1.5 py-0.5 rounded bg-[#edf5ef]">
                    {country.code}
                  </span>
                  <span className="font-medium text-[#080f0f]">{country.name}</span>
                </div>
                <span className="font-mono font-bold text-[#3b5240]">
                  {country.visitors.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
