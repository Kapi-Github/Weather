import { useParams } from "react-router-dom";

const HourDetailsSite = () => {
    const { hour } = useParams();

    return <div>Godzina {hour}</div>;
};

export default HourDetailsSite;
