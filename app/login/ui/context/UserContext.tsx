'use client'
import React, { createContext, useEffect, useState } from "react";
import { UserManagement } from '../../application/userManagement'
import { IUser, emptyUser} from '../../domain/IUser'
import { UserService } from "../../infrastructure/user.service";
import { signOut, useSession } from "next-auth/react";

export type UserContextType = {
    currentUser: IUser;
    setCurrentUser: React.Dispatch<React.SetStateAction<IUser>>;
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
    users: IUser[] | null;
    registerUser: (user: IUser)=>void;
    updateUser: (user: IUser) => void; 
    deleteUser: (user: IUser) => void;
};


// Creamos un contexto para manejar los productos
export const UserContext = createContext<UserContextType | null>(null);

export type UserProviderProps = {
    children?: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [updateView, setUpdateView] = useState(new Date());
    const [isEdit, setIsEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState(emptyUser);
    const [users, setUsers] = useState<IUser[] | null>(null);
    const {data} = useSession();
    const manager = new UserManagement(new UserService());

    const registerUser = async (user: IUser | undefined): Promise<void> => {
    // console.log("user: ", user)
        if (!user) {
        console.error("No user provided");
        return; // Retornamos null si el usuario no fue definido.
    }

    try {
        const data = await manager.registerUser(user); // Llama al método de UserManagement.
        // console.log("data: ", data)
        if (data.success) { // Supone que 'data.success' indica el éxito de la operación.
            // console.log("User registered successfully:", data);
            return 
        } else {
            console.log("Registration failed:", data);
            throw new Error
            // return undefined; // Devuelve undefined si no fue exitoso.
        }
        
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error
    }
};

const updateUser = async (user: IUser): Promise<void> => {
    // console.log("user: ", user)
    if (!user) {
        console.error("No user provided");
        return; // Retornamos null si el usuario no fue definido.
    }

    try {
        const dato = await manager.updateUser(user.email, user ); // Llama al método de UserManagement.

        if (dato.success) { // Supone que 'data.success' indica el éxito de la operación.
            // console.log("User update successfully:", data);
            // setUpdateView(new Date()); // Actualiza la vista.
        } else {
            // console.warn("Registration failed:", data);
            throw new Error
            // return undefined; // Devuelve undefined si no fue exitoso.
        }
    } catch (error) {
        // console.error("Error registering user:", error);
        throw new Error
    // return null; // Devuelve null en caso de error.
    }
};
    const deleteUser = (user:IUser)=>{
        manager.deleteUser(user).then(data =>{
            if(data.success){
              signOut({callbackUrl: "/"})
            }
        })
    }


    return (
        <UserContext.Provider value={{
            currentUser,
            setCurrentUser,
            isEdit,
            setIsEdit,
            users,
            registerUser,
            updateUser,
            deleteUser,
            // handleSubmitRegister, // Agregamos esta función al contexto
        }}>
            {children}
        </UserContext.Provider>
    );
};
