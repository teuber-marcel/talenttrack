const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getVacancies = async () => {
  const response = await fetch(`${API_URL}/api/vacancies`);
  return response.json();
};

export const getVacancyById = async (id) => {
  const response = await fetch(`${API_URL}/api/vacancies/${id}`);
  return response.json();
};

export const deleteVacancy = async (id) => {
  if (!id) {
    console.error("No ID transmitted for DELETE request.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/vacancies/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`Error when deleting: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("API error:", error);
    return false;
  }
};

export const getVacancyWithApplicantsById = async (id) => {
  try {
    console.log(`Calling API: ${process.env.NEXT_PUBLIC_API_URL}/api/vacancies/${id}/details`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vacancies/${id}/details`);
    const data = await response.json();
    console.log("API Response Data:", data);
    return data;
  } catch (error) {
    console.error("Error in getVacancyWithApplicantsById:", error);
    return null;
  }
};
