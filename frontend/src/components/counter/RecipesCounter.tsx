import "./RecipesCounter.css";

type RecipesCounterProps = {
    amount: number;
    title: string;
    link?: string;
    imageSrc: string;
    width?: number;
    height?: number,
    onClick?: () => void;
}

export default function RecipesCounter(props: RecipesCounterProps) {
    return (
        <div className="counter-box" onClick={props.onClick}>
            <div className="title-link">
                <a href={props.amount > 0 && props.link ? props.link : ""} onClick={(e) => e.preventDefault()}>
                    <img
                        width={props.width ? props.width : 50}
                        height={props.height ? props.height : 50}
                        src={props.imageSrc}
                        alt=""
                    />
                    <div>{props.title}</div>
                </a>
            </div>
            <div className="count">
                {props.amount}
            </div>
        </div>
    )
}