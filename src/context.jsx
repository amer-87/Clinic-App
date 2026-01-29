import { useState, useEffect, useReducer, useMemo } from "react";
import { ClinicContext } from "./contextDef";
export { ClinicContext } from "./contextDef";

const initialState = {
  patients: [],
  selectedPatientId: null,
  user: {
    name: "",
    username: "",
    role: "doctor",
    createdAt: new Date().toISOString(),
    // Doctor settings
    cardBackgroundColor: "#ffffff",
    cardBorderColor: "#e5e7eb",
    cardShadowColor: "rgba(0,0,0,0.05)",
    formBackgroundColor: "#f0f9ff",
    formBorderColor: "#3b82f6",
    doctorInfoBackgroundColor: "#dbeafe",
    doctorInfoBorderColor: "#2563eb",
    doctorInfoTextColor: "#1e40af",
    detailsBackgroundColor: "#dbeafe",
    detailsTextColor: "#1e40af",
    prescriptionTextColor: "#000000",
    doctorInfoFontSize: "16",
    detailsFontSize: "14",
    doctorInfoBackgroundImage: "",
    textareaBackgroundImage: "",
    detailsBackgroundImage: "",
    title: "",
    phone: "",
    specialization: ""
  }
};

function clinicReducer(state, action) {
  switch(action.type) {
    case "ADD_PATIENT": return { ...state, patients: [action.payload, ...state.patients] };
    case "UPDATE_PATIENT": {
      const { id, changes } = action.payload;
      return { ...state, patients: state.patients.map(p => p.id===id ? {...p,...changes} : p) };
    }
    case "SET_STATUS": {
      const { id, status } = action.payload;
      return { ...state, patients: state.patients.map(p => p.id===id ? {...p,status} : p) };
    }
    case "REMOVE_PATIENT": {
      const { id } = action.payload;
      return { ...state, patients: state.patients.filter(p => p.id !== id) };
    }
    case "REMOVE_ALL_PATIENTS": return { ...state, patients: [] };
    case "SET_SELECTED_PATIENT_ID": {
      const { id } = action.payload;
      return { ...state, selectedPatientId: id };
    }
    case "UPDATE_USER": {
      const { changes } = action.payload;
      return { ...state, user: { ...state.user, ...changes } };
    }
    default: return state;
  }
}

export function ClinicProvider({ children }) {
  const [persist,setPersist] = useLocalStorage("clinic-store", initialState);
  const [state,dispatch] = useReducer(clinicReducer, persist);

  useEffect(()=>setPersist(state), [state, setPersist]);

  const api = useMemo(() => ({
    // Patient management
    addPatient: (patient) => dispatch({ type:"ADD_PATIENT", payload:patient }),
    updatePatient: (id, changes) => dispatch({ type:"UPDATE_PATIENT", payload:{id,changes} }),
    setStatus: (id,status) => dispatch({ type:"SET_STATUS", payload:{id,status} }),
    removePatient: (id) => dispatch({ type:"REMOVE_PATIENT", payload:{id} }),
    removeAllPatients: () => dispatch({ type:"REMOVE_ALL_PATIENTS" }),
    setSelectedPatientId: (id) => dispatch({ type:"SET_SELECTED_PATIENT_ID", payload:{id} }),
    updateUser: (changes) => dispatch({ type:"UPDATE_USER", payload:{changes} })
  }), []);

  return <ClinicContext.Provider value={{state,...api}}>{children}</ClinicContext.Provider>;
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      // Ignore parse errors
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  }, [key, value]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          setValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
        } catch {
          setValue(initialValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [value, setValue];
}
