const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getVacancies = async () => {
  const response = await fetch(`${API_URL}/api/vacancies`);
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