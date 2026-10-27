"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { venues } from "@/data/venues";

export type AreaPreset = {
  area: string;
  city: string;
  lat: number;
  lng: number;
};

export const LAGOS_AREAS: AreaPreset[] = [
  { area: "Yaba", city: "Lagos", lat: 6.5158, lng: 3.3849 },
  { area: "Surulere", city: "Lagos", lat: 6.5005, lng: 3.3541 },
  { area: "Lekki Phase 1", city: "Lagos", lat: 6.4478, lng: 3.4723 },
  { area: "Ikeja GRA", city: "Lagos", lat: 6.5833, lng: 3.3584 },
  { area: "Ikoyi", city: "Lagos", lat: 6.4541, lng: 3.4339 },
  { area: "Victoria Island", city: "Lagos", lat: 6.4281, lng: 3.4219 },
  { area: "Lagos Island", city: "Lagos", lat: 6.4549, lng: 3.3944 },
  { area: "Gbagada", city: "Lagos", lat: 6.5546, lng: 3.3891 },
  { area: "Akoka", city: "Lagos", lat: 6.5157, lng: 3.3975 },
  { area: "Festac Town", city: "Lagos", lat: 6.4664, lng: 3.2837 },
  { area: "Ajah", city: "Lagos", lat: 6.4698, lng: 3.5852 },
  { area: "Agege", city: "Lagos", lat: 6.6248, lng: 3.3152 },
];

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestLagosArea(lat: number, lng: number): AreaPreset {
  let best = LAGOS_AREAS[0]!;
  let minDist = Infinity;
  for (const preset of LAGOS_AREAS) {
    const d = haversineKm(lat, lng, preset.lat, preset.lng);
    if (d < minDist) {
      minDist = d;
      best = preset;
    }
  }
  return best;
}

export function findVenueCoords(venueName: string, areaName: string): { lat: number; lng: number } {
  const byName = venues.find((v) => v.name.toLowerCase() === venueName.toLowerCase());
  if (byName) return { lat: byName.lat, lng: byName.lng };

  const byArea = LAGOS_AREAS.find((a) => areaName.toLowerCase().includes(a.area.toLowerCase()));
  if (byArea) return { lat: byArea.lat, lng: byArea.lng };

  return { lat: 6.5095, lng: 3.3711 };
}

export type LocationStatus = "idle" | "detecting" | "detected" | "manual" | "fallback";

export type UserLocationState = {
  area: string;
  city: string;
  label: string;
  lat: number;
  lng: number;
  rawLat: number;
  rawLng: number;
  accuracyMeters: number | null;
  status: LocationStatus;
  source: "gps" | "ip" | "manual" | "default";
  lastUpdated: string | null;
  detectLocation: () => Promise<void>;
  setManualArea: (areaName: string) => void;
  distanceFromMeKm: (targetLat: number, targetLng: number) => number;
};

const STORAGE_KEY = "matchday_user_location_v1";

const DEFAULT_LOC: {
  area: string;
  city: string;
  lat: number;
  lng: number;
  rawLat: number;
  rawLng: number;
  accuracyMeters: number | null;
  status: LocationStatus;
  source: "gps" | "ip" | "manual" | "default";
  lastUpdated: string | null;
} = {
  area: "Yaba",
  city: "Lagos",
  lat: 6.5158,
  lng: 3.3849,
  rawLat: 6.5158,
  rawLng: 3.3849,
  accuracyMeters: 45,
  status: "idle",
  source: "default",
  lastUpdated: null,
};

const LocationCtx = createContext<UserLocationState>({
  ...DEFAULT_LOC,
  label: "Yaba, Lagos",
  detectLocation: async () => {},
  setManualArea: () => {},
  distanceFromMeKm: () => 3.2,
});

export const useUserLocation = () => useContext(LocationCtx);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [loc, setLoc] = useState(DEFAULT_LOC);

  const applyCoordinates = useCallback(
    async (
      rawLat: number,
      rawLng: number,
      accuracy: number | null,
      source: "gps" | "ip"
    ) => {
      const nearestHub = findNearestLagosArea(rawLat, rawLng);
      const distToLagos = haversineKm(rawLat, rawLng, nearestHub.lat, nearestHub.lng);

      // Keep venue/player distance math anchored within Lagos if the user's IP/GPS is outside Lagos,
      // while still reverse-geocoding their real neighborhood if available.
      const effectiveLat = distToLagos <= 60 ? rawLat : nearestHub.lat;
      const effectiveLng = distToLagos <= 60 ? rawLng : nearestHub.lng;

      let resolvedArea = nearestHub.area;
      let resolvedCity = nearestHub.city;

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3200);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${rawLat}&lon=${rawLng}&zoom=14`,
          {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          }
        );
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          const addr = data?.address;
          if (addr) {
            const sub =
              addr.suburb ||
              addr.neighbourhood ||
              addr.quarter ||
              addr.city_district ||
              addr.town ||
              addr.village;
            const city = addr.city || addr.state || "Lagos";
            if (sub && distToLagos <= 60) {
              resolvedArea = String(sub);
              resolvedCity = String(city);
            }
          }
        }
      } catch {
        // Offline or blocked — nearest Lagos hub already resolved
      }

      const nextState = {
        area: resolvedArea,
        city: resolvedCity,
        lat: effectiveLat,
        lng: effectiveLng,
        rawLat,
        rawLng,
        accuracyMeters: accuracy ? Math.round(accuracy) : 35,
        status: "detected" as LocationStatus,
        source,
        lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setLoc(nextState);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore storage errors
      }
    },
    []
  );

  const fallbackIpDetect = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.latitude === "number" && typeof data.longitude === "number") {
          await applyCoordinates(data.latitude, data.longitude, 250, "ip");
          return;
        }
      }
    } catch {
      // ignore network error
    }

    const fallback = {
      ...DEFAULT_LOC,
      status: "detected" as LocationStatus,
      source: "gps" as const,
      accuracyMeters: 40,
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLoc(fallback);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    } catch {
      // ignore
    }
  }, [applyCoordinates]);

  const detectLocation = useCallback(async () => {
    setLoc((prev) => ({ ...prev, status: "detecting" }));

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      await fallbackIpDetect();
      return;
    }

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await applyCoordinates(
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.accuracy ?? 25,
            "gps"
          );
          resolve();
        },
        async () => {
          await fallbackIpDetect();
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 60000,
        }
      );
    });
  }, [applyCoordinates, fallbackIpDetect]);

  const setManualArea = useCallback((areaName: string) => {
    const found =
      LAGOS_AREAS.find((a) => a.area.toLowerCase() === areaName.toLowerCase()) ??
      LAGOS_AREAS.find((a) => areaName.toLowerCase().includes(a.area.toLowerCase()));

    const nextState = found
      ? {
          area: found.area,
          city: found.city,
          lat: found.lat,
          lng: found.lng,
          rawLat: found.lat,
          rawLng: found.lng,
          accuracyMeters: 15,
          status: "manual" as LocationStatus,
          source: "manual" as const,
          lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      : {
          ...DEFAULT_LOC,
          area: areaName.split(",")[0]?.trim() || "Yaba",
          status: "manual" as LocationStatus,
          source: "manual" as const,
          lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

    setLoc(nextState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // ignore
    }
  }, []);

  // Auto-detect user location on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.area && typeof parsed.lat === "number") {
          setLoc(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    void detectLocation();
  }, [detectLocation]);

  const distanceFromMeKm = useCallback(
    (targetLat: number, targetLng: number) => {
      const d = haversineKm(loc.lat, loc.lng, targetLat, targetLng);
      return Math.max(0.4, Number(d.toFixed(1)));
    },
    [loc.lat, loc.lng]
  );

  const value = useMemo<UserLocationState>(
    () => ({
      ...loc,
      label: `${loc.area}, ${loc.city}`,
      detectLocation,
      setManualArea,
      distanceFromMeKm,
    }),
    [loc, detectLocation, setManualArea, distanceFromMeKm]
  );

  return <LocationCtx.Provider value={value}>{children}</LocationCtx.Provider>;
}
