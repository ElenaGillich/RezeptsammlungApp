import Spinner from "../spinner/Spinner.tsx";
import SaveButton from "../saveButton/SaveButton.tsx";

type PageTitleProps = {
    hasSpinner?: boolean;
    hasSaveButton?: boolean;
    hasMealPlanCreationButton?: boolean;
    isButtonDisabled?: boolean;
    hasButtonSpinner?: boolean;
    title: string | undefined;
    hasAdditionalText?: boolean;
    additionalText?: string;
    onClick?: () => void;
}

export default function PageTitle(props: Readonly<PageTitleProps>) {
    const {
        hasSpinner, hasSaveButton, hasMealPlanCreationButton, title,
        hasAdditionalText, additionalText, hasButtonSpinner, isButtonDisabled
    } = props;

    return (
        <div className="display-flex items-center under-header">
            <div className="page-title-box">
                <div className="center for-spinner-in-page-title">
                    {hasSpinner && <Spinner/>}
                </div>

                <div className="section">
                    <div className="page-title">
                        {title ?? " "}
                    </div>

                    {(hasAdditionalText && !hasSpinner) && <div className="error">{additionalText}</div>}
                </div>
            </div>

            {hasSaveButton &&
                <SaveButton isDisabled={isButtonDisabled as boolean} hasSpinner={hasButtonSpinner as boolean}/>
            }
            {hasMealPlanCreationButton &&
                <button
                    className="custom-button"
                    disabled={isButtonDisabled}
                    onClick={() => props.onClick?.()}
                >
                    {isButtonDisabled ? "Erstellung..." : "Neu erstellen"}
                </button>
            }
        </div>
    )
}
