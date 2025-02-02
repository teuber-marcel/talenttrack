const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getApplicants = async () => {
  const response = await fetch(`${API_URL}/api/applicants?populate=vacancy`);
  return response.json();
};

export const deleteApplicant = async (id) => {
  if (!id) {
    console.error("No ID transmitted for DELETE request.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/applicants/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`Error when deleting: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("API error:", error);
    return false;
  }
};

export const getApplicantsByVacancy = async (vacancyId) => {
  try {
    const response = await fetch(`${API_URL}/api/vacancies/${vacancyId}/details`);
    if (!response.ok) {
      throw new Error(`Error fetching applicants: ${response.statusText}`);
    }
    const data = await response.json();
    return data.applicants;
  } catch (error) {
    console.error("API error in getApplicantsByVacancy:", error);
    return [];
  }
};

export const getApplicantById = async (id) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applicants/${id}`);
  return response.json();
};
