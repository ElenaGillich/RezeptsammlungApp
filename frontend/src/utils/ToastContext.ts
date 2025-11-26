import {createContext} from "react";

type ToastApi = {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);