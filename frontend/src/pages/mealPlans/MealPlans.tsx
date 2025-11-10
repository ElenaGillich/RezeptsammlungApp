import type {MealPlan} from "../../models/MealPlan.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {localStorageKey} from "../../const.ts";
import MealPlanCard from "../../components/mealPlanCard/MealPlanCard.tsx";
import "./MealPlans.css"
import {Tooltip} from "react-tooltip";

export default function MealPlans() {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [activeMealPlanID, setActiveMealPlanID] = useState<string | null>(
        localStorage.getItem(localStorageKey)
    );

    useEffect(() => {
        loadAllMealPlans();
    }, []);

    function loadAllMealPlans() {
        axios
            .get("/api/meal-plan/all")
            .then((result) => setMealPlans(result.data))
            .catch(() => alert("Fehler beim Laden der Speisepläne!"));
    }

    function removeMealPlan(planId: string) {
        if (!confirm("Möchten Sie den Speiseplan wirklich löschen?")) {
            return;
        }

        axios.delete(`/api/meal-plan/${planId}`)
            .then(() => {
                const filtered = mealPlans.filter(plan => plan.id !== planId);
                setMealPlans(filtered);

                if (localStorage.getItem(localStorageKey) === planId) {
                    localStorage.removeItem(localStorageKey);
                    setActiveMealPlanID(null);
                    alert("Die aktive Speisekarte wird gerade gelöscht! Damit die ausgewählten Gerichte " +
                        "zu einer bestimmten Speisekarte hinzugefügt werden können, muss diese erst aktiviert werden.");
                }
            })
            .catch(() => alert("Fehler beim Löschen des Speiseplanes!"));
    }

    function selectPlan(planId: string) {
        setActiveMealPlanID(planId);
        localStorage.setItem(localStorageKey, planId);
    }

    return (
        <>
            <h2 className="page-title">Meine Speisepläne</h2>

            <div className="container">
                {mealPlans.length < 1 && <h2>Keine Speisepläne vorhanden!</h2>}

                {mealPlans.length > 0 && (
                    <div className="plan-cards">
                        {mealPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className="plan"
                            >
                                <button
                                    onClick={() => selectPlan(plan.id)}
                                    className={`plan-selection ${plan.id === activeMealPlanID ? "selected" : ""}`}
                                >
                                    {plan.id !== activeMealPlanID ?
                                        <div className="circle"
                                             data-tooltip-id="noActive"
                                             data-tooltip-content="Aktivieren"
                                             data-tooltip-place="left"
                                        /> :
                                        <img
                                            width={36}
                                            height={36}
                                            src="/checked.png"
                                            alt="Checked icon"
                                            data-tooltip-id="active"
                                            data-tooltip-content="Der Speiseplan ist gerade aktiv"
                                            data-tooltip-place="left"
                                        />
                                    }
                                </button>

                                <Tooltip id="noActive" noArrow className="tooltip"/>
                                <Tooltip id="active" noArrow className="tooltip"/>
                                <Tooltip id="remove" noArrow className="tooltip"/>
                                <Tooltip id="products" noArrow className="tooltip"/>

                                <MealPlanCard
                                    mealPlan={plan}
                                    isActive={plan.id === activeMealPlanID}
                                    onRemoveMealPlan={removeMealPlan}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
