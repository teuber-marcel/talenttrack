// applicantService.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;


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

export const postLinkedInJob = async (jobData) => {
  const response = await fetch(`${API_URL}/api/linkedin/post-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  return response.json();
};

export const receiveLinkedInApplicants = async () => {
  const response = await fetch(`${API_URL}/api/linkedin/applicants`);
  return response.json();
};