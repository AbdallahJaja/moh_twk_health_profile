// src/context/HealthDataContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Define types for our data structure
interface Allergy {
  id: number;
  name: string;
  severity: string;
  date: string;
}

interface VitalHistory {
  date: string;
  value: number | { systolic: number; diastolic: number };
}

interface Vital {
  value: number | { systolic: number; diastolic: number } | null;
  history: VitalHistory[];
}

interface HealthCondition {
  id: number;
  name: string;
  date: string;
}

interface FamilyHistoryItem {
  id: number;
  name: string;
  relation: string;
  date: string;
}

// Main health data structure
export interface HealthData {
  allergies: {
    medicine: Allergy[];
    food: Allergy[];
    material: Allergy[];
    doctor: Allergy[];
  };
  vitals: {
    bmi: Vital;
    bloodPressure: Vital;
    bloodGlucose: Vital;
    waist: Vital;
    weight: Vital;
    height: Vital;
  };
  general: {
    bloodType: string | null;
    healthConditions: HealthCondition[];
    familyHistory: FamilyHistoryItem[];
  };
  lastUpdated: Record<string, string>;
}

// Context type definition
interface HealthDataContextType {
  healthData: HealthData;
  updateData: (category: string, type: string, value: any) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

// Create context
const HealthDataContext = createContext<HealthDataContextType | undefined>(
  undefined
);

// Mock initial data
const initialHealthData: HealthData = {
  allergies: {
    medicine: [],
    food: [],
    material: [],
    doctor: [],
  },
  vitals: {
    bmi: { value: null, history: [] },
    bloodPressure: { value: null, history: [] },
    bloodGlucose: { value: null, history: [] },
    waist: { value: null, history: [] },
    weight: { value: null, history: [] },
    height: { value: null, history: [] },
  },
  general: {
    bloodType: null,
    healthConditions: [],
    familyHistory: [],
  },
  lastUpdated: {},
};

// Props for provider component
interface HealthDataProviderProps {
  children: ReactNode;
}

// Create provider component
export const HealthDataProvider: React.FC<HealthDataProviderProps> = ({
  children,
}) => {
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock data on mount
  useEffect(() => {
    setTimeout(() => {
      // Mock data with a few sample items
      setHealthData({
        ...initialHealthData,
        allergies: {
          ...initialHealthData.allergies,
          medicine: [
            {
              id: 1,
              name: "باراسيتامول",
              severity: "mild",
              date: "2023-05-15",
            },
            { id: 2, name: "أسبرين", severity: "severe", date: "2023-09-22" },
          ],
          food: [
            { id: 1, name: "فراولة", severity: "mild", date: "2023-04-10" },
            { id: 2, name: "مكسرات", severity: "severe", date: "2023-07-05" },
          ],
        },
        vitals: {
          ...initialHealthData.vitals,
          bmi: {
            value: 24.5,
            history: [{ date: "2023-01-01", value: 24.5 }],
          },
          bloodPressure: {
            value: { systolic: 120, diastolic: 80 },
            history: [
              { date: "2023-02-01", value: { systolic: 120, diastolic: 80 } },
            ],
          },
        },
        general: {
          ...initialHealthData.general,
          bloodType: "O+",
          healthConditions: [{ id: 1, name: "ربو خفيف", date: "2022-11-22" }],
          familyHistory: [
            { id: 1, name: "سكري", relation: "والد", date: "2022-12-15" },
          ],
        },
        lastUpdated: {
          "allergies.medicine": "2023-09-22T10:30:00Z",
          "allergies.food": "2023-07-05T14:20:00Z",
          "vitals.bmi": "2023-01-01T08:00:00Z",
          "vitals.bloodPressure": "2023-02-01T09:15:00Z",
          "general.bloodType": "2022-10-10T13:20:00Z",
          "general.healthConditions": "2022-11-22T15:40:00Z",
          "general.familyHistory": "2022-12-15T14:10:00Z",
        },
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update health data
  const updateData = async (
    category: string,
    type: string,
    value: any
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Create a deep copy of current data
      const updatedData = JSON.parse(JSON.stringify(healthData)) as HealthData;

      // Update the specific data based on category and type
      if (category === "allergies") {
        if (
          type === "medicine" ||
          type === "food" ||
          type === "material" ||
          type === "doctor"
        ) {
          (updatedData.allergies as any)[type] = value;
        }
      } else if (category === "vitals") {
        if (
          type === "bmi" ||
          type === "bloodPressure" ||
          type === "bloodGlucose" ||
          type === "waist" ||
          type === "weight" ||
          type === "height"
        ) {
          (updatedData.vitals as any)[type] = value;
        }
      } else if (category === "general") {
        if (
          type === "bloodType" ||
          type === "healthConditions" ||
          type === "familyHistory"
        ) {
          (updatedData.general as any)[type] = value;
        }
      }

      // Update last updated timestamp
      updatedData.lastUpdated[`${category}.${type}`] = new Date().toISOString();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update state
      setHealthData(updatedData);
      setError(null);
      return true;
    } catch (err) {
      console.error("Error updating health data:", err);
      setError("فشل في تحديث البيانات الصحية");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HealthDataContext.Provider
      value={{
        healthData,
        updateData,
        isLoading,
        error,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

// Custom hook to use the health data context
export const useHealthData = (): HealthDataContextType => {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error("useHealthData must be used within a HealthDataProvider");
  }
  return context;
};
