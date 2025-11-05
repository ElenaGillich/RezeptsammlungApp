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
                onClick={() => navigate("/")}
            >
                <img
                    width={30}
                    height={30}
                    src="/dashboard.png"
                    alt="Menu-Icon"
                />
            </button>
            <Navbar/>
        </header>
    )
}