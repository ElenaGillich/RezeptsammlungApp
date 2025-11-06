import "./Header.css";
import Navbar from "../Navbar.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

type HeaderProps = {
    hasMenuIcon: boolean;
}

export default function Header(props: HeaderProps) {
    const navigate = useNavigate();
    const [showMenuIcon, setShowMenuIcon] = useState<boolean>(false);

    useEffect(() => {
        setShowMenuIcon(props.hasMenuIcon)
    }, [props.hasMenuIcon]);

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
                    alt="Dashboard-Icon"
                />
            </button>
            <Navbar/>

            {showMenuIcon &&
                <button
                    type={"button"}
                    className="action-button"
                    aria-label="Rezept zum Speiseplan hinzufügen"
                    onClick={() => navigate("/meal-plan")}
                >
                    <img
                        width={30}
                        height={30}
                        src="/meal-plan.png"
                        alt="Menu-Icon"
                    />
                </button>
            }
        </header>
    )
}