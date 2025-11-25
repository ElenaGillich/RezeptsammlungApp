import Spinner from "../spinner/Spinner.tsx";

type SaveButtonProps = {
    isDisabled: boolean;
    hasSpinner: boolean
}

export default function SaveButton(props: SaveButtonProps) {
    return (
        <button
            className="custom-button"
            disabled={props.isDisabled}
        >
            {
                props.hasSpinner ?
                    <div className="center">
                        <Spinner/>
                        <div className="button-name">Speicherung...</div>
                    </div>
                : "Speichern"
            }
        </button>
    );
}