import {useState} from "react";
import {Dialog} from "primereact/dialog";
import "./MealPlanDialog.css"

type MealPlanDialogProps = {
    isMealPlanPage?: boolean;
    isCreating?: boolean;
    visible: boolean;
    onHide: () => void;
    onNavigateToMealPlans?: () => void;
    onCreateNewPlan: (name: string) => void;
};

export default function MealPlanDialog(props: Readonly<MealPlanDialogProps>) {
    const {visible, onHide, onNavigateToMealPlans, onCreateNewPlan} = props;
    const [newPlanName, setNewPlanName] = useState<string>("");

    const handleCreate = () => {
        if (!newPlanName.trim()) {
            return;
        }

        onCreateNewPlan(newPlanName);
        setNewPlanName("");
        onHide();
    };

    return (
        <Dialog
            header={props.isMealPlanPage ? "Kein aktiver Speiseplan" : "Erstellung eines neuen Speiseplans"}
            visible={visible}
            modal
            onHide={onHide}
        >
            {!props.isMealPlanPage &&
                <div>
                    <div className="center">
                        <p>
                            Um Rezepte in einem bestimmten Speiseplan sammeln zu können, muss dieser erst aktiviert
                            werden.
                            Es gibt derzeit keinen aktiven Speiseplan.
                            <br/>
                            Sie können jetzt zu der Seite mit allen Speisepläne navigieren,
                            um dort einen der vorhandenen zu aktivieren.
                        </p>
                    </div>

                    <div className="center">
                        <button
                            className="custom-button"
                            disabled={props.isCreating}
                            onClick={() => {
                                onHide();
                                if (onNavigateToMealPlans) {
                                    onNavigateToMealPlans();
                                }
                            }}
                        >
                            Zu meinen Speiseplänen
                        </button>
                    </div>

                    <hr/>

                    <p>Hier können Sie einen neuen Speiseplan erstellen, der automatisch aktiviert wird.</p>
                </div>
            }
            <div className="new-plan">
                <h4 className={"required"}>Wie nennen wir den neuen Speiseplan?</h4>

                <input
                    value={newPlanName}
                    required
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="Name des neuen Plans"
                    className="full-width"
                />

                <div className="center">
                    <button
                        className="custom-button"
                        disabled={!newPlanName.trim() || props.isCreating}
                        onClick={handleCreate}
                    >
                        {props.isCreating ? "Erstellen..." : "Erstellen und aktivieren"}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
