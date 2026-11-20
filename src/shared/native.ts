import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";

/** Runs only inside the Capacitor Android shell; a no-op in the browser. */
export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  document.documentElement.classList.add("native");

  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
  } catch { /* status bar not available */ }

  // Hardware / gesture back: go back in the hash history, exit from the first screen.
  await App.addListener("backButton", () => {
    const atRoot = window.location.hash.replace(/^#\/?/, "") === "";
    if (atRoot || window.history.length <= 1) void App.exitApp();
    else window.history.back();
  });
}
