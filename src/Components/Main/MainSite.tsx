import React, { useContext } from "react";
import DayDetails from "./DayDetails/DayDetails";
import WeatherInfo from "./Header/WeatherInfo";
import DayInfo from "./Header/DayInfo";
import { TemperatureContext } from "../../App";

const MainSite = () => {
    const { city } = useContext(TemperatureContext);

    return (
        <React.Fragment>
            <DayInfo city={city} />
            <WeatherInfo />
            <DayDetails />
        </React.Fragment>
    );
};

export default MainSite;
