
import { createContext, useContext, useState } from "react";

export const RoleContext= createContext();

export const useRoleContext = () => {
    return useContext(RoleContext)
}

export const RoleContextProvider= ({children}) => {

    const [roleUser, setRoleUser]= useState(JSON.parse(localStorage.getItem('role-user')) || null);

    return <RoleContext.Provider value={{roleUser, setRoleUser}}>
        {children}
    </RoleContext.Provider>
}