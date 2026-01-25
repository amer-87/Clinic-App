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

const initialUserState = { 
  user: null,
  backgroundImage: ""
 };

function userReducer(state, action) {
  switch(action.type) {
    case "SET_USER": {
      return { ...state, user: action.payload };
    }
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
      username: "owner",
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
    case "SET_PASSWORD": {
      const { username, password } = action.payload;
      return {
        ...state,
        users: state.users.map(u =>
          u.username === username
            ? { ...u, password }
            : u
        )
      };
    }
    case "UPDATE_OWNER": {
      const { newUsername, newPassword } = action.payload;
      return {
        ...state,
        users: state.users.map(u =>
          u.role === 'owner'
            ? { ...u, username: newUsername, password: newPassword }
            : u
        )
      };
    }
    case "UPDATE_USER": {
      const { username, changes } = action.payload;
      return {
        ...state,
        users: state.users.map(u =>
          u.username === username
            ? { ...u, ...changes }
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

  // Initialize owner account if not exists and migrate old data
  useEffect(() => {
    const hasOwner = usersState.users.some(user => user.role === 'owner');
    
    // Check if we need to migrate old email-based data to username-based
    const needsMigration = usersState.users.some(user => 
      user.email && !user.username
    );
    
    if (needsMigration) {
      console.log("Migrating old user data from email to username...");
      // Clear old data and reset with new structure
      localStorage.removeItem('clinic-users');
      localStorage.removeItem('clinic-user');
      
      // Force reload to reinitialize with correct data
      window.location.reload();
      return;
    }
    
    if (!hasOwner) {
      const ownerAccount = {
        name: "المالك",
        username: "owner",
        role: "owner",
        status: "approved",
        password: "owner123",
        createdAt: new Date().toISOString()
      };
      usersDispatch({ type: "ADD_USER", payload: ownerAccount });
      console.log("Owner account created");
    }
  }, [usersState.users]);

  // Auto-login removed for security - users must login manually

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
      // Trim whitespace from inputs
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      console.log("Login attempt:", trimmedUsername);
      console.log("Available users:", usersState.users.map(u => ({ 
        username: u.username, 
        email: u.email,
        role: u.role, 
        status: u.status 
      })));

      // Find user by username or email (for backward compatibility)
      const user = usersState.users.find(u => {
        const userIdentifier = u.username || u.email || '';
        return userIdentifier.toLowerCase() === trimmedUsername.toLowerCase() && 
               u.password === trimmedPassword && 
               u.status === 'approved';
      });

      console.log("Found user:", user ? { 
        username: user.username || user.email, 
        role: user.role 
      } : "No user found");

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
    setPassword: (username, password) => usersDispatch({ type: "SET_PASSWORD", payload: { username, password } }),
    updateOwner: (newUsername, newPassword) => usersDispatch({ type: "UPDATE_OWNER", payload: { newUsername, newPassword } }),
    updateUser: (changes) => {
      usersDispatch({ type: "UPDATE_USER", payload: { username: userState.user.username, changes } });
      const updatedUser = { ...userState.user, ...changes };
      userDispatch({ type: "SET_USER", payload: updatedUser });
    }
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
