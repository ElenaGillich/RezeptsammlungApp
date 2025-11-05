import {Link} from "react-router-dom";

export default function Navbar() {

    return (
        <nav className={"navbar"}>
            <Link className="nav-link" to={"/recipes"}> Alle Rezepte </Link>
            <Link className="nav-link" to={"/recipes/favorites"}> Favoriten </Link>
            <Link className="nav-link" to={"/info"}> Hinweise </Link>
            <Link className="nav-link" to={"/recipes/new"}> Rezept anlegen</Link>
        </nav>
    )
}