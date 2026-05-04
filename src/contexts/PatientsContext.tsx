import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Patient } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';

const STORAGE_KEY = 'mga.patients.v1';

interface PatientsContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'> & { id?: string }) => Patient;
  updatePatient: (id: string, update: Partial<Patient>) => void;
  resetPatients: () => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

// JSON.stringify converts Date -> string. When loading from storage we need to
// revive every Date field on Patient back into a real Date instance.
function revivePatient(raw: any): Patient {
  return {
    ...raw,
    lastANCDate: raw.lastANCDate ? new Date(raw.lastANCDate) : new Date(),
    ussdData: raw.ussdData
      ? {
          ...raw.ussdData,
          submittedAt: raw.ussdData.submittedAt
            ? new Date(raw.ussdData.submittedAt)
            : new Date(),
        }
      : undefined,
    actionsTaken: Array.isArray(raw.actionsTaken)
      ? raw.actionsTaken.map((a: any) => ({
          ...a,
          timestamp: a.timestamp ? new Date(a.timestamp) : new Date(),
        }))
      : [],
    feedbackData: raw.feedbackData
      ? {
          ...raw.feedbackData,
          outcomeDate: raw.feedbackData.outcomeDate
            ? new Date(raw.feedbackData.outcomeDate)
            : undefined,
        }
      : undefined,
  } as Patient;
}

function loadFromStorage(): Patient[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(revivePatient);
  } catch {
    return null;
  }
}

function saveToStorage(patients: Patient[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch {
    // Ignore quota / serialization errors — store is purely a simulation aid.
  }
}

// Returns the next patient id (e.g. "P005") that won't collide with anything
// already in the store. Falls back to length-based numbering if no numeric ids
// are present.
function nextPatientId(patients: Patient[]): string {
  let max = 0;
  for (const p of patients) {
    const match = /^P(\d+)$/.exec(p.id ?? '');
    if (match) {
      const n = parseInt(match[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  const next = Math.max(max + 1, patients.length + 1);
  return `P${String(next).padStart(3, '0')}`;
}

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const fromStorage = loadFromStorage();
    if (fromStorage && fromStorage.length > 0) return fromStorage;
    return mockPatients;
  });

  useEffect(() => {
    saveToStorage(patients);
  }, [patients]);

  const value = useMemo<PatientsContextType>(
    () => ({
      patients,
      addPatient: (patient) => {
        const id = patient.id ?? nextPatientId(patients);
        const full = { ...patient, id } as Patient;
        setPatients((prev) => [full, ...prev]);
        return full;
      },
      updatePatient: (id, update) => {
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...update } : p))
        );
      },
      resetPatients: () => {
        setPatients(mockPatients);
      },
    }),
    [patients]
  );

  return (
    <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error('usePatients must be used within a PatientsProvider');
  return ctx;
}
