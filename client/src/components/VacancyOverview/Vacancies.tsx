import React, {useEffect,useState} from "react";
import VacancyElement from './VacancyElement';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Vacancies = () => {
	const [vacancies, setVacancies] = useState<Vacancy[]>([]);

	useEffect(() => {
		getVacancies();
	}, []);

	const getVacancies = async () => {
		const response = await fetch(`${API_URL}/api/vacancies`);
		const responseBody = await response.json();
		setVacancies(responseBody);
	}
	
	const deleteVacancy = async (id: string) => {
		await fetch(`${API_URL}/api/vacancies/` + id, {
			method: "DELETE"
		})
		getVacancies();
	}

	return (
		<div>
			{vacancies.map(vacancy =>
				<VacancyElement
					key={vacancy._id}
					vacancy={vacancy}
					deleteVacancy={deleteVacancy}
				/>
			)}
		</div>
	)
}

export default Vacancies