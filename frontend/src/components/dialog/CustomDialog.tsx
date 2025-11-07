import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./CustomDialog.css"

type CustomDialogProps = {
    visible: boolean;
    onHide: () => void;
    onNavigateToMealPlans: () => void;
    onCreateNewPlan: (name: string) => void;
};

export default function CustomDialog(props: CustomDialogProps) {
    const {visible, onHide, onNavigateToMealPlans, onCreateNewPlan} = props;
    const [newPlanName, setNewPlanName] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleCreate = () => {
        if (!newPlanName.trim()) return;

        setIsCreating(true);
        onCreateNewPlan(newPlanName);
        setIsCreating(false);
        setNewPlanName("");
        onHide();
    };

    return (
        <Dialog
            header="Kein aktiver Speiseplan"
            visible={visible}
            modal
            onHide={onHide}
        >
            <p>Du hast keinen aktiven Speiseplan.</p>
            <p>Was möchtest du tun?</p>

            <div className="p-mt-3">
                <Button
                    label="Zu meinen Speiseplänen"
                    icon="pi pi-list"
                    className="p-button-secondary p-mr-2"
                    onClick={() => {
                        onHide();
                        onNavigateToMealPlans();
                    }}
                />
            </div>

            <hr />

            <div>
                <p>Oder neuen Speiseplan erstellen:</p>

                <label> Wie soll der neue Speiseplan heißen?{' '}
                    <input
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        placeholder="Name des neuen Plans"
                        className="full-width"
                    />
                </label>
                <Button
                    label={isCreating ? "Erstellen..." : "Erstellen und aktivieren"}
                    icon="pi pi-check"
                    disabled={!newPlanName.trim() || isCreating}
                    onClick={handleCreate}
                />
            </div>
        </Dialog>
    );
}
