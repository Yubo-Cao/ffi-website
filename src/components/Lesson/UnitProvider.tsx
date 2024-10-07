"use client";

import { getUnit, Unit } from "@/lib/course";
import { createContext, useContext } from "react";
import useSWR from "swr";

const UnitContext = createContext<{
  unit: Unit;
  setUnit: (unit: Unit) => void;
  isLoading: boolean;
  error: Error | null;
}>({
  unit: null,
  setUnit: () => {},
  isLoading: false,
  error: null,
});

const UnitProvider = ({ params, children }) => {
  const {
    data: unit,
    isLoading,
    error,
    mutate: setUnit,
  } = useSWR<Unit>(`/units/${params.unitId}`, () => getUnit(params.unitId));

  return (
    <UnitContext.Provider value={{ unit, setUnit, isLoading, error }}>
      {children}
    </UnitContext.Provider>
  );
};

const useUnit = () => {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
};

export { UnitProvider, useUnit };
