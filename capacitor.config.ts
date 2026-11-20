import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lieferoo.app",
  appName: "Lieferoo",
  webDir: "dist",
  android: { backgroundColor: "#FFFFFF" },
  plugins: {
    SplashScreen: { launchShowDuration: 0, backgroundColor: "#333333" },
  },
};

export default config;
