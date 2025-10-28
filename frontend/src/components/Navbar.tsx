import {Link} from "react-router-dom";

export default function Navbar() {

    return (
        <header className="header">
            <nav className={"navbar"}>
                <Link to={"/"}> Dashboard /</Link>
                <Link to={"/recipes"}> Alle Rezepte /</Link>
                <Link to={"/recipes/new"}> Rezept hinzufügen /</Link>
            </nav>
        </header>
    )
}