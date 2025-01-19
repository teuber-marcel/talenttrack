import React from "react";
import Vacancies from "../components/VacancyOverview/Vacancies";

const VacanciesOverview = () => {

    console.log("Rendered VacanciesOverview");

    return (
        <div>
            <h1>Vacancies Overview</h1>
            <Vacancies />
        </div>
    )
}

export default VacanciesOverview;