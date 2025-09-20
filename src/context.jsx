import { useState, useEffect, useReducer, useMemo } from "react";
import { ClinicContext } from "./contextDef";
export { ClinicContext } from "./contextDef";

const initialState = { patients: [], selectedPatientId: null };

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
    default: return state;
  }
}

const initialUserState = { user: null };

function userReducer(state, action) {
  switch(action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

const initialUsersState = { 
  users: [
    {
      name: "المالك",
      email: "aamerblack@gmail.com",
      role: "owner",
      status: "approved",
      password: "owner123", // يمكن تغييرها لاحقاً
      createdAt: new Date().toISOString()
    }
  ] 
};

function usersReducer(state, action) {
  switch(action.type) {
    case "ADD_USER": {
      console.log("ADD_USER action payload:", action.payload);
      const newState = { ...state, users: [...state.users, action.payload] };
      console.log("New users state:", newState.users);
      return newState;
    }
    case "APPROVE_USER": {
      const { email, approvedBy, tempPassword } = action.payload;
      return {
        ...state,
        users: state.users.map(u =>
          u.email === email
            ? { ...u, status: 'approved', approvedBy, password: tempPassword }
            : u
        )
      };
    }
    case "SET_PASSWORD": {
      const { email, password } = action.payload;
      return {
        ...state,
        users: state.users.map(u =>
          u.email === email
            ? { ...u, password }
            : u
        )
      };
    }
    case "ADD_SECRETARY": {
      const { name, email, doctorEmail, password } = action.payload;
      const newSecretary = {
        name,
        email,
        role: "secretary",
        status: "approved",
        doctorEmail,
        password
      };
      return { ...state, users: [...state.users, newSecretary] };
    }
    case "REJECT_USER": {
      const { email, rejectedBy } = action.payload;
      return {
        ...state,
        users: state.users.map(u =>
          u.email === email
            ? { ...u, status: 'rejected', rejectedBy }
            : u
        )
      };
    }
    default:
      return state;
  }
}

export function ClinicProvider({ children }) {
  const [persist,setPersist] = useLocalStorage("clinic-store", initialState);
  const [state,dispatch] = useReducer(clinicReducer, persist);

  const [userPersist, setUserPersist] = useLocalStorage("clinic-user", initialUserState);
  const [userState, userDispatch] = useReducer(userReducer, userPersist);

  const [usersPersist, setUsersPersist] = useLocalStorage("clinic-users", initialUsersState);
  const [usersState, usersDispatch] = useReducer(usersReducer, usersPersist);

  useEffect(()=>setPersist(state), [state, setPersist]);
  useEffect(()=>setUserPersist(userState), [userState, setUserPersist]);
  useEffect(()=>setUsersPersist(usersState), [usersState, setUsersPersist]);

  useEffect(() => {
    console.log("Users state updated:", usersState.users);
  }, [usersState.users]);

  // Initialize owner account if not exists
  useEffect(() => {
    const hasOwner = usersState.users.some(user => user.role === 'owner');
    if (!hasOwner) {
      const ownerAccount = {
        name: "المالك",
        email: "aamerblack@gmail.com",
        role: "owner",
        status: "approved",
        password: "owner123",
        createdAt: new Date().toISOString()
      };
      usersDispatch({ type: "ADD_USER", payload: ownerAccount });
      console.log("Owner account created");
    }
  }, [usersState.users]);

  const api = useMemo(() => ({
    // Patient management
    addPatient: (patient) => dispatch({ type:"ADD_PATIENT", payload:patient }),
    updatePatient: (id, changes) => dispatch({ type:"UPDATE_PATIENT", payload:{id,changes} }),
    setStatus: (id,status) => dispatch({ type:"SET_STATUS", payload:{id,status} }),
    removePatient: (id) => dispatch({ type:"REMOVE_PATIENT", payload:{id} }),
    removeAllPatients: () => dispatch({ type:"REMOVE_ALL_PATIENTS" }),
    setSelectedPatientId: (id) => dispatch({ type:"SET_SELECTED_PATIENT_ID", payload:{id} }),
    
    // User authentication
    login: (username, password) => {
      console.log("Login attempt:", username, password);
      console.log("Available users:", usersState.users);
      
      const user = usersState.users.find(
        u => u.email === username && u.password === password && u.status === 'approved'
      );
      
      console.log("Found user:", user);
      
      if (user) {
        userDispatch({ type: "SET_USER", payload: user });
        return true;
      }
      return false;
    },
    setUser: (user) => userDispatch({ type: "SET_USER", payload: user }),
    logout: () => userDispatch({ type: "LOGOUT" }),
    user: userState.user,
    
    // User management
    users: usersState.users,
    addUser: (user) => usersDispatch({ type: "ADD_USER", payload: user }),
    approveUser: (email, approvedBy, tempPassword) => usersDispatch({ type: "APPROVE_USER", payload: { email, approvedBy, tempPassword } }),
    rejectUser: (email, rejectedBy) => usersDispatch({ type: "REJECT_USER", payload: { email, rejectedBy } }),
    setPassword: (email, password) => usersDispatch({ type: "SET_PASSWORD", payload: { email, password } }),
    addSecretary: (name, email, doctorEmail, password) => usersDispatch({ type: "ADD_SECRETARY", payload: { name, email, doctorEmail, password } }),
    getPendingUsers: (role) => usersState.users.filter(u => u.status === 'pending' && u.role === role)
  }), [userState.user, usersState.users]);

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
