import "./Header.css";
import Navbar from "../Navbar.tsx";
import {useNavigate} from "react-router-dom";
import {Tooltip} from "react-tooltip";

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
                aria-label="Meine Speisepläne"
                onClick={() => navigate("/meal-plans")}
                data-tooltip-id="toMenu"
                data-tooltip-content="Meine Speisepläne"
                data-tooltip-place="bottom"
            >
                <img
                    width={30}
                    height={30}
                    src="/meal-plan.png"
                    alt="Menu-Icon"
                />
            </button>
            <Tooltip id="toMenu" noArrow className="tooltip"/>
        </header>
    )
}