import { useEffect } from "react";

// Warnung NUR beim Schließen oder Aktualisieren der Seite.
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges) return;
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);
}
