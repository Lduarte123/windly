import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "./authContext/AuthContext";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const { user } = useAuth();
  const defaultConfig = {
    temp_unit: "C",
    pressure_unit: "hPa",
    wind_unit: "m/s",
    notifications_enabled: true,
  };
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    async function fetchConfig() {
      if (user?.id) {
        try {
          const res = await api.get(`/user-config/${user.id}`);
          if (res.data && Object.keys(res.data).length > 0) {
            setConfig(res.data);
          } else {
            setConfig(defaultConfig);
          }
        } catch (e) {
          setConfig(defaultConfig);
        }
      } else {
        setConfig(defaultConfig);
      }
    }
    fetchConfig();
  }, [user]);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}