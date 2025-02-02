const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createInterview = async (applicantId) => {
  try {
    const response = await fetch(`${API_URL}/api/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicant: applicantId,
        interviewDate: new Date(Date.now() + 86400000),
        interviewStartDate: new Date(Date.now() + 86400000), // tomorrow
        interviewEndDate: new Date(Date.now() + 90000000)    // tomorrow + 1 hour
      })
    });
    if (!response.ok) {
      throw new Error('Failed to create interview');
    }
    return response.json();
  } catch (error) {
    console.error('Error in createInterview:', error);
    throw error;
  }
};

export const generateQuestions = async (interviewId) => {
  try {
    const response = await fetch(`${API_URL}/api/interviews/${interviewId}/generate-questions`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('API Response for generate-questions:', data); // Debug-Log
    return data;
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    throw error;
  }
};

export const getInterviewByApplicantId = async (applicantId) => {
  try {
    const response = await fetch(`${API_URL}/api/interviews?applicant=${applicantId}`);
    const interviews = await response.json();
    console.log('API Response for interviews:', interviews); // Debug-Log
    return interviews.length > 0 ? interviews[0] : null;
  } catch (error) {
    console.error('Error in getInterviewByApplicantId:', error);
    return null;
  }
};

export const downloadInterviewQuestions = async (interviewId) => {
  try {
    const response = await fetch(`${API_URL}/api/interviews/${interviewId}/download-questions`);
    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_questions_${interviewId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Error downloading questions:', error);
    return false;
  }
};

export const saveInterviewQuestions = async (interviewId, questions) => {
  try {
    const response = await fetch(`${API_URL}/api/interviews/${interviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions })
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving questions:', error);
    throw error;
  }
};
