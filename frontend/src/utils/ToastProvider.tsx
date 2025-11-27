import {type ReactNode, useMemo, useRef} from "react";
import { Toast } from "primereact/toast";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
    const toastRef = useRef<Toast | null>(null);

    const success = (message: string) =>
        toastRef.current?.show({
            severity: "success",
            summary: "Erfolg",
            detail: message,
            life: 3000,
        });

    const error = (message: string) =>
        toastRef.current?.show({
            severity: "error",
            summary: "Fehler",
            detail: message,
            life: 4000,
        });

    const warn = (message: string) =>
        toastRef.current?.show({
            severity: "warn",
            summary: "Warnung",
            detail: message,
            life: 4000,
        });

    const info = (message: string) =>
        toastRef.current?.show({
            severity: "info",
            summary: "Info",
            detail: message,
            life: 10000,
        });

    const value = useMemo(() => (
        { success, error, warn, info }), []
    );

    return (
        <ToastContext.Provider value={value}>
            <Toast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
}
