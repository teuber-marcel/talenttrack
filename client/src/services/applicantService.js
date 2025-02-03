// applicantService.js

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
    const response = await fetch(`${API_URL}/api/applicants/${id}`, {
      method: "DELETE",
    });

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
  const response = await fetch(`${API_URL}/api/applicants/${id}`);
  return response.json();
};

export const getApplicantsForOverview = async () => {
  try {
    const response = await fetch("/api/applicants");

    if (!response.ok) {
      throw new Error("Failed to fetch applicants");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
};

/**
 * PATCH the applicant's status field to a new value.
 *
 * @param {string} id - The applicant's ID.
 * @param {string} newStatus - The new status to set (e.g., "Rejected").
 * @returns {object} The updated applicant object from the API.
 * @throws If the PATCH request fails.
 */
export const updateApplicantStatus = async (id, newStatus) => {
  if (!id) {
    throw new Error("No applicant ID provided for status update.");
  }

  try {
    const response = await fetch(`${API_URL}/api/applicants/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update applicant status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API error updating applicant status:", error);
    throw error;
  }
};
