import "./RecipesCounter.css";

type RecipesCounterProps = {
    amount: number;
    title: string;
    imageSrc: string;
    width?: number;
    height?: number,
    onClick?: () => void;
}

export default function RecipesCounter(props: Readonly<RecipesCounterProps>) {
    return (
        <div className="counter-box">
            <div className="title-link">
                <button onClick={(e) => {
                       e.preventDefault();
                       props.onClick?.();
                   }}
                >
                    <img
                        width={props.width ? props.width : 50}
                        height={props.height ? props.height : 50}
                        src={props.imageSrc}
                        loading="lazy"
                        alt=""
                    />
                    <div>{props.title}</div>
                </button>
            </div>
            <div className="count">
                {props.amount}
            </div>
        </div>
    )
}