import type {MealPlan} from "../../models/MealPlan.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import MealPlanCard from "../../components/mealPlanCard/MealPlanCard.tsx";
import "./MealPlans.css"
import {Tooltip} from "react-tooltip";
import ProductsToBuy from "../../components/productsToBuy/ProductsToBuy.tsx";
import {useAddRecipeToMealPlan} from "../../utils/useAddRecipeToMealPlan.ts";
import CustomDialog from "../../components/dialog/CustomDialog.tsx";
import Spinner from "../../components/spinner/Spinner.tsx";
import {localStorageKey} from "../../models/LocalStorageConst.ts";
import PageTitle from "../../components/pageTitle/PageTitle.tsx";

export default function MealPlans() {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [activeMealPlan, setActiveMealPlan] = useState<MealPlan | null>(null);
    const [isProductListOpen, setIsProductListOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>();
    const {dialogVisible, setDialogVisible, createNewMealPlan, isProcessing} = useAddRecipeToMealPlan();

    useEffect(() => {
        setIsLoading(true);
        loadAllMealPlans();
    }, [isProcessing]);

    function loadAllMealPlans() {
        axios
            .get("/api/meal-plan/all")
            .then((result) => {
                setMealPlans(result.data);
                for (const mealPlan of result.data) {
                    if (mealPlan.id === localStorage.getItem(localStorageKey)) {
                        setActiveMealPlan(mealPlan);
                    }
                }
            })
            .catch(() => alert("Fehler beim Laden der Speisepläne!"))
            .finally(() => setIsLoading(false));
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
                    localStorage.clear();
                    setActiveMealPlan(null);
                    alert("Die aktive Speisekarte wird gerade gelöscht! Damit die ausgewählten Gerichte " +
                        "zu einer bestimmten Speisekarte hinzugefügt werden können, muss diese erst aktiviert werden.");
                }
            })
            .catch(() => alert("Fehler beim Löschen des Speiseplanes!"));
    }

    function selectPlan(plan: MealPlan) {
        setActiveMealPlan(plan);
        localStorage.clear();
        localStorage.setItem(localStorageKey, plan.id);

        for (const recipe of plan.recipes) {
            localStorage.setItem(recipe.id, plan.id);
        }
    }

    function updateMealPlans(updated: MealPlan) {
        console.log(updated)
        if (updated.id === activeMealPlan?.id) {
            setActiveMealPlan(updated)
        }

        setMealPlans(prev => prev.map(plan => plan.id === updated.id ? updated : plan));
    }

    return (
        <>
            <div className="display-flex items-center">
                <PageTitle title="Meine Speisepläne"></PageTitle>

                <button
                    className="custom-button"
                    disabled={isProcessing}
                    onClick={() => setDialogVisible(true)}
                >
                    {isProcessing ? "Erstellung..." : "Neu erstellen"}
                </button>
            </div>

            <div className="container">
                {isLoading &&
                    <div className="center">
                        <Spinner size={36}/>
                    </div>
                }
                {(!isLoading && mealPlans.length < 1) && <h2>Keine Speisepläne vorhanden!</h2>}

                {mealPlans.length > 0 && (
                    <div className="content">
                        <div className="plan-cards">
                            {mealPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="plan"
                                >
                                    <button
                                        onClick={() => selectPlan(plan)}
                                        className={`plan-selection ${plan.id === activeMealPlan?.id ? "selected" : ""}`}
                                    >
                                        {plan.id === activeMealPlan?.id
                                            ? <img
                                                width={36}
                                                height={36}
                                                src="/checked.png"
                                                alt="Checked icon"
                                                data-tooltip-id="active"
                                                data-tooltip-content="Der Speiseplan ist gerade aktiv"
                                                data-tooltip-place="left"
                                            />
                                            : <div className="circle"
                                                   data-tooltip-id="noActive"
                                                   data-tooltip-content="Aktivieren"
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
                                        isActive={plan.id === activeMealPlan?.id}
                                        onRemoveMealPlan={removeMealPlan}
                                        isProductListVisible={isProductListOpen}
                                        onShowProducts={() => setIsProductListOpen(true)}
                                        onRemoveRecipeFromMealPlan={(mealPlan: MealPlan) => updateMealPlans(mealPlan)}
                                    />
                                </div>
                            ))}
                        </div>

                        {activeMealPlan?.recipes &&
                            <div className="plan-products">
                                {(!isProductListOpen || activeMealPlan.recipes.length < 1) &&
                                    <p className="notice">
                                        In diesem Bereich kann man alle Zutaten aus den Rezepten des
                                        {' '}<b> aktiven </b> Speiseplans einsehen, um daraus eine Einkaufsliste erstellen
                                        zu können. <br/> Zu diesem Zweck wird das Icon {' '}
                                        <img
                                            width={30}
                                            height={28}
                                            src="/grocery.png"
                                            alt="Grocery-Icon"
                                        />{' '}
                                        zum Aufrufen der Zutatenliste verwendet, das nur für den grün markierten und
                                        mit dem Icon {' '}
                                        <img
                                            width={30}
                                            height={28}
                                            src="/checked.png"
                                            alt="Checklist-Icon"
                                        /> {' '}
                                        gekennzeichneten <b>aktiven Speiseplan</b> verfügbar ist,
                                        sofern dieser Speiseplan nicht leer ist.
                                    </p>
                                }

                                <ProductsToBuy
                                    recipes={activeMealPlan?.recipes}
                                    isOpen={isProductListOpen}
                                    onClose={() => setIsProductListOpen(false)}
                                />
                            </div>
                        }
                    </div>
                )}
            </div>

            <CustomDialog
                isMealPlanPage={true}
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onCreateNewPlan={createNewMealPlan}
            />
        </>
    );
}
