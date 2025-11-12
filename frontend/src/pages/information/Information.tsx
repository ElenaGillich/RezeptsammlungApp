import "./Information.css";
import {dimensions, units} from "../../const.ts";

export default function Information() {

    return (
        <>
            <p className="page-title">Einige nützliche Informationen</p>
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
            </div>
        </>
    )
}
