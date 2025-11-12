import {useState} from "react";
import {Dialog} from "primereact/dialog";
import "./CustomDialog.css"

type CustomDialogProps = {
    isMealPlanPage?: boolean;
    isCreating?: boolean;
    visible: boolean;
    onHide: () => void;
    onNavigateToMealPlans?: () => void;
    onCreateNewPlan: (name: string) => void;
};

export default function CustomDialog(props: Readonly<CustomDialogProps>) {
    const {visible, onHide, onNavigateToMealPlans, onCreateNewPlan} = props;
    const [newPlanName, setNewPlanName] = useState<string>("");

    const handleCreate = () => {
        if (!newPlanName.trim()) return;

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
                    <div className="in-center">
                        <p>
                            Um Rezepte in einem bestimmten Speiseplan sammeln zu können, muss dieser erst aktiviert
                            werden.
                            Es gibt derzeit keinen aktiven Speiseplan.
                            <br/>
                            Sie können jetzt zu der Seite mit allen Speisepläne navigieren,
                            um dort einen der vorhandenen zu aktivieren.
                        </p>
                    </div>

                    <div className="in-center">
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

                    <p>Hier können Sie einen neuen Speiseplan erstellen, der wird automatisch aktiviert.</p>
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

                <div className="in-center">
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
