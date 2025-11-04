import {useRef} from "react";
import {Toast} from "primereact/toast";

export function useToast() {
    const toast = useRef<Toast | null>(null);

    const showSuccess = (message: string, summary = "Erfolg") => {
        toast.current?.show({
            severity: "success",
            summary,
            detail: message,
            life: 3000,
        });
    };

    const showError = (message: string, summary = "Fehler") => {
        toast.current?.show({
            severity: "error",
            summary,
            detail: message,
            life: 4000,
        });
    };

    const showWarn = (message: string, summary = "Warnung") => {
        toast.current?.show({
            severity: "warn",
            summary,
            detail: message,
            life: 4000,
        });
    };

    const showInfo = (message: string, summary = "Info") => {
        toast.current?.show({
            severity: "info",
            summary,
            detail: message,
            life: 3000,
        });
    };

    return {
        ToastElement: <Toast ref={toast}/>,
        showSuccess,
        showError,
        showWarn,
        showInfo,
    };
}
