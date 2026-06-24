import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import log from "@/shared/logger";
import { getDb, setupDb } from "@/database/initialize";

export default function useSplashInitialize() {
  const [isReady, setIsReady] = useState(false);
  const db = getDb();
  useDrizzleStudio(db);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    async function initializeApplication() {
      try {
        setupDb();
      } catch (e) {
        log.error(e);
      } finally {
        setIsReady(true);
      }
    }
    initializeApplication();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  return { isReady };
}
