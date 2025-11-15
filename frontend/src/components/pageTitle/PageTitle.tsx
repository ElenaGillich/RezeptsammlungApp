type PageTitleProps = {
    hasSpinner?: boolean;
    title: string;
    hasAdditionalText?: boolean;
    additionalText?: string;
}

export default function PageTitle(props: Readonly<PageTitleProps>) {
    return (
        <div className="page-title-box">
            {props.hasSpinner && <></> }
            <div className="center for-spinner-in-page-title"></div>
            <div className="section">
                <div className="page-title">
                    {props.title}
                </div>
                {props.hasAdditionalText && <div className="error">{props.additionalText}</div>}
            </div>
        </div>
    )
}