import React from "react";

type Vacancy = {
    _id: string;
    title: string;
    department: string;
	hierarchy: string;
    description: string;
    requirements: string;
	other: string;
    status: string;
	createdAt: Date;
	updatedAt: Date;
};

type VacancyProps = {
    vacancy: Vacancy;
    deleteVacancy: (id: string) => void;
};

const VacancyElement: React.FC<VacancyProps> = ({vacancy, deleteVacancy}) => {
	return (
		<div>
			{vacancy.title}
			{vacancy.department}
			{vacancy.status}
			<button onClick={() => deleteVacancy(vacancy._id)}>Delete</button>
		</div>
	)
}

export default VacancyElement