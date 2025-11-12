import {useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import "./CustomDialog.css"

type CustomDialogProps = {
    visible: boolean;
    onHide: () => void;
    onNavigateToMealPlans?: () => void;
    onCreateNewPlan: (name: string) => void;
};

export default function CustomDialog(props: Readonly<CustomDialogProps>) {
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
            <div className="in-center">
                <p>
                    Um Rezepte in einem bestimmten Speiseplan sammeln zu können, muss dieser erst aktiviert werden.
                    Es gibt derzeit keinen aktiven Speiseplan.
                    <br/>
                    Sie können einen neuen erstellen (der wird automatisch aktiviert) oder auf die Seite navigieren,
                    um dort einen der vorhandenen Speisepläne zu aktivieren.
                </p>
            </div>


            <div className="p-mt-3">
                <Button
                    label="Zu meinen Speiseplänen"
                    icon="pi pi-list"
                    className="p-button-secondary p-mr-2"
                    onClick={() => {
                        onHide();
                        if (onNavigateToMealPlans) {
                            onNavigateToMealPlans();
                        }
                    }}
                />
            </div>

            <hr/>

            <div>
                <p>Neuen Speiseplan erstellen:</p>
                <h4 className={"required"}>Wie nennen wir den neuen Speiseplan?</h4>

                <input
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="Name des neuen Plans"
                    className="full-width"
                />

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
