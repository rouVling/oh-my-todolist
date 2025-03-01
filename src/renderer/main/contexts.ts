import React from "react";
import { useContext } from "react";
import { StorageSchema } from "../utils/types";
import { defaultStorage } from "../utils/types";

// export const setThemeContext = React.createContext<React.Dispatch<React.SetStateAction<"dark" | "light">> | null>(null);
export const setThemeContext = React.createContext<any | null>(null);

export const storageContext = React.createContext<{ storageValue: StorageSchema, setStorage: any}>({ storageValue: defaultStorage, setStorage: null });
