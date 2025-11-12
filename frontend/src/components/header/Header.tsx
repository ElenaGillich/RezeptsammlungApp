import "./Header.css";
import Navbar from "../Navbar.tsx";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header>
            <button
                type={"button"}
                className="action-button"
                aria-label="Dashboard"
                onClick={() => navigate("/dashboard")}
            >
                <img
                    width={30}
                    height={30}
                    src="/dashboard.png"
                    alt="Dashboard-Icon"
                />
            </button>

            <Navbar/>

            <button
                type={"button"}
                className="action-button"
                aria-label="Rezept zum Speiseplan hinzufügen"
                onClick={() => navigate("/meal-plans")}
            >
                <img
                    width={30}
                    height={30}
                    src="/meal-plan.png"
                    alt="Menu-Icon"
                />
            </button>
        </header>
    )
}