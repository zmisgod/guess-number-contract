import { createContext, useState, useEffect } from "react"

export const ContractContext = createContext();

export const ContractContextProvider = function ({ children }) {
    const [accounts, setAccounts] = useState([])

    useEffect(() =>{
        setAccounts(["222"])
    }, [])

    return (
        <ContractContext.Provider value={{
            accounts,
        }}>
            {children}
        </ContractContext.Provider>
    )
}