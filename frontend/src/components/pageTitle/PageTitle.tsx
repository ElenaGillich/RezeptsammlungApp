import Spinner from "../spinner/Spinner.tsx";

type PageTitleProps = {
    hasSpinner?: boolean;
    title: string | undefined;
    hasAdditionalText?: boolean;
    additionalText?: string;
}

export default function PageTitle(props: Readonly<PageTitleProps>) {
    const {hasSpinner, title, hasAdditionalText, additionalText} = props

    return (
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
    )
}