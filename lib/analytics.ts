// Google Analytics 4 (GA4) Telemetry & Event Tracking Utility

export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-YYWWSXPPKN";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      actionOrTarget: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Send custom event to Google Analytics
 */
export function trackGAEvent(
  action: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  try {
    window.gtag("event", action, {
      ...params,
      send_to: GA_TRACKING_ID,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.debug("GA Event error:", err);
  }
}

/**
 * Track password generation event
 */
export function trackPasswordGeneration(
  mode: string,
  length: number,
  entropyBits: number
): void {
  trackGAEvent("password_generated", {
    event_category: "Engagement",
    event_label: mode,
    password_mode: mode,
    password_length: length,
    entropy_bits: Math.round(entropyBits),
    value: length,
  });
}

/**
 * Track copy to clipboard action
 */
export function trackCopyToClipboard(mode: string, entropyBits?: number): void {
  trackGAEvent("copy_to_clipboard", {
    event_category: "Conversion",
    event_label: mode,
    password_mode: mode,
    entropy_bits: entropyBits ? Math.round(entropyBits) : undefined,
  });
}

/**
 * Track blog article engagement
 */
export function trackBlogArticleRead(slug: string, title: string): void {
  trackGAEvent("article_view", {
    event_category: "Blog",
    event_label: slug,
    article_slug: slug,
    article_title: title,
  });
}

/**
 * Track Ko-fi donation / coffee modal open
 */
export function trackSupportClick(source: string = "footer"): void {
  trackGAEvent("support_coffee_click", {
    event_category: "Monetization",
    event_label: source,
  });
}
