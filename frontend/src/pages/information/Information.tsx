import "./Information.css";
import {dimensions, units} from "../../components/const.ts";

export default function Information() {

    return (
        <>
            <p className="page-title">Einige nützliche Hinweise</p>
            <div className="container">
                <div className="display-flex">
                    <div>
                        <h3>Abkürzungen:</h3>

                        {units.map(unit =>
                            <div className="units" key={unit.short}>
                                <div className="short">{unit.short}</div>
                                <div>-</div>
                                <div className="full">{unit.full}</div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3>Maße:</h3>

                        {dimensions.map(d =>
                            <div className="units" key={d.short}>
                                <div className="short">{d.short}</div>
                                <div>-</div>
                                <div className="full">{d.full}</div>
                            </div>
                        )}

                        <br/>
                        <h3>Weizenmehl</h3>
                        <p>
                            <b>Type 405</b> - hellste und feinste Weizenmehl für feines Gebäck wie Kuchen und Kekse,
                            Hefeteig, Pizza und auch zum Binden von Soßen.
                        </p>
                        <p>
                            <b>Type 550</b> - das ideale (etwas kräftigeres aber immer noch helles) Mehl für helles Brot
                            /
                            Brötchen und Kleingebäck.
                        </p>
                        <p>
                            <b>Typen 812, 1050, 1600</b> - eignen sich für herzhafte Backwaren wie Brot.
                        </p>
                        <br/>

                        <h3>Roggenmehl</h3>
                        <p>
                            <b>Type 815</b> - hellste Roggenmehl, das sich zum Backen von herzhaften Backwaren wie Brot
                            und Brötchen eignet.
                        </p>
                        <p>
                            <b>Typen 997, 1150</b> - deutlich dunkleres Mehl. Wird gerne zum Brotbacken verwendet.
                        </p>
                        <p>
                            <b>Typen 1370, 1740</b> - sehr dunkles Roggenmehl. Ideal für Sauerteigbrote und Mischbrote.
                        </p>
                    </div>
                </div>

                <hr/>

                <div style={{display: "flex", flexFlow: "column", fontSize: "12px"}}>
                    <h3>Icon-Quellen:</h3>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/herz" title="herz Icons">Herz Icons erstellt von Anggara - Flaticon</a>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/herz" title="herz Icons">Herz Icons erstellt von msidiqf - Flaticon</a>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/erstellen" title="erstellen Icons">Erstellen Icons erstellt von Mayor Icons - Flaticon</a>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/beitrag-hinzufugen" title="beitrag hinzufügen Icons">Beitrag hinzufügen Icons erstellt von Designspace Team - Flaticon</a>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/werkzeuge-bearbeiten" title="werkzeuge bearbeiten Icons">Werkzeuge bearbeiten Icons erstellt von zky.icon - Flaticon</a>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/deinstallieren" title="deinstallieren Icons">Deinstallieren Icons erstellt von POD Gladiator - Flaticon</a>
                    <a href="https://www.flaticon.com/de/kostenlose-icons/kochen" title="kochen Icons">Kochen Icons erstellt von Sir.Vector - Flaticon</a>
                </div>
            </div>
        </>
    )
}
