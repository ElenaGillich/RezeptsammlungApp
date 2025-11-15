import "./Spinner.css";

type SpinnerProps = {
    size?: number;
};

export default function Spinner(props: Readonly<SpinnerProps>) {
    const size = props.size ?? 24;

    return (
        <div className="spinner"
            style={{
                width: size,
                height: size,
                borderWidth: size > 30 ? 5 : 3
            }}
        />
    );
}
