import {type ChangeEvent, type KeyboardEvent, useRef, useState} from "react";
import axios from "axios";
import "./AskAI.css";
import PageTitle from "../../components/pageTitle/PageTitle.tsx";

export default function AskAI() {
    const [request, setRequest] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        setRequest(event.target.value);
    }

    function startRequest() {
        if (!request) {
            return;
        }

        setLoading(true);
        setError(null);
        setResponse("");

        const controller = new AbortController();
        controllerRef.current = controller;

        axios.post("/api/chat", request, {signal: controller.signal})
            .then((result) => {
                setResponse(result.data);
            })
            .catch((error) => {
                if (axios.isCancel(error) || error.name === "CanceledError") {
                    setError("Die Anfrage wurde vom Benutzer storniert.");
                } else {
                    setError("Fehler! Ihre Anfrage konnte nicht bearbeitet werden. " + error.message);
                }
            })
            .finally(() => setLoading(false))
    }

    function cancelRequest() {
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
            setLoading(false);
        }
    }

    function reset() {
        setError(null);
        setRequest("");
        setResponse("");
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" && !!request) {
            event.preventDefault();
            startRequest();
        } else if (event.key === "Escape") {
            event.preventDefault();
            reset();
        }
    };

    return (
        <>
            <PageTitle title="Anfrage an künstliche Intelligenz"></PageTitle>
            <div className="container">
                <div className="note">
                    <span>Frage die KI nach einer Zutat, </span>
                    <br/>
                    <span>um Informationen über diese, ihre Verwendung und geeignete Ersatzprodukte zu erhalten.</span>
                </div>

                <div className="request-box">
                    <label>Name der Zutat:{' '}
                        <input
                            type="text"
                            className="full-width"
                            value={request} maxLength={50}
                            onKeyDown={handleKeyDown}
                            onChange={(event) => handleInput(event)}
                        />
                    </label>

                    {loading ? (
                        <>
                            <div className="process wait">
                                <b>Anfrage wird bearbeitet. Bitte warten</b>
                                <div className="dots"></div>
                            </div>
                            <button className="custom-button" onClick={cancelRequest}>Abbrechen</button>
                        </>
                    ) : (
                        <button className="custom-button" onClick={startRequest}>Start</button>
                    )}
                </div>

                <div className="response">
                    <textarea
                        rows={15}
                        disabled
                        value={error || response}
                        className="full-width"
                        placeholder="Hier wird Ihre Anfrage beantwortet..."
                    ></textarea>

                    {(!loading && (request || response)) &&
                        <button className="custom-button" onClick={reset}>Reset</button>}
                </div>
            </div>
        </>
    )
}