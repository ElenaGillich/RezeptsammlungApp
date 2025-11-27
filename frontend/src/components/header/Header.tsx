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

            <div className="buttons">
                <button
                    type={"button"}
                    className="action-button"
                    aria-label="Anmerkungen"
                    onClick={() => navigate("/info")}
                    data-tooltip-id="notes"
                    data-tooltip-content="Anmerkungen"
                    data-tooltip-place="bottom"
                >
                    <img
                        width={30}
                        height={30}
                        src="/notes.png"
                        alt="Notes-Icon"
                    />
                </button>

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
                        src="/menu.png"
                        alt="Menu-Icon"
                    />
                </button>
            </div>
            
            <Tooltip id="notes" noArrow className="tooltip"/>
            <Tooltip id="toMenu" noArrow className="tooltip"/>
        </header>
    )
}