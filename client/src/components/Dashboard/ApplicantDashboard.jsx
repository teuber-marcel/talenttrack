import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

const ApplicantDashboard = () => {
  const [applicants2, setApplicants] = useState([]);
  const [vacancyTitles, setVacancyTitles] = useState({});

  useEffect(() => {
    getApplicants();
  }, []);

  const getApplicants = async () => {
    const response = await fetch("http://localhost:5555/api/applicants");
    const data = await response.json();
    if (Array.isArray(data)) {
      const sortedApplicants = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setApplicants(sortedApplicants);
      fetchVacancyTitles(sortedApplicants);
    } else {
      console.error("Expected an array but got:", data);
    }
  };

  const fetchVacancyTitles = async (applicants) => {
    const titles = {};
    for (const applicant of applicants) {
      if (applicant.vacancy) {
        const title = await getVacancyTitlebyID(applicant.vacancy);
        titles[applicant.vacancy] = title;
      }
    }
    setVacancyTitles(titles);
  };

  const getVacancyTitlebyID = async (id) => {
    const response = await fetch(`http://localhost:5555/api/vacancies/${id}`);
    const data = await response.json();
    return data.title;
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff" }}>
      <h3
        style={{ textAlign: "center", marginBottom: "10px", color: "#212529" }}
      >
        New Applicants
      </h3>
      <div
        style={{
          overflowY: "auto",
          height: "90%",
          paddingTop: "10px",
          paddingBottom: "10px",
          scrollbarWidth: "thin",
          scrollbarColor: "#adb5bd #f8f9fa",
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f8f9fa;
              border-radius: 8px;
            }
            div::-webkit-scrollbar-thumb {
              background-color: #adb5bd;
              border-radius: 8px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background-color: #6c757d;
            }
          `}
        </style>
        {applicants2.map((applicant, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
              padding: "10px",
              borderBottom: "1px solid #dee2e6",
              backgroundColor: "#ffffff",
            }}
          >
            {applicant.photo ? (
              <Link href={`/applicants/details/${applicant._id}`}>
                <img
                  src={applicant.photo}
                  alt={`${applicant.prename} ${applicant.surname}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "15px",
                  }}
                />
              </Link>
            ) : (
              <Link href={`/applicants/details/${applicant._id}`}>
                <FaUserCircle
                  style={{
                    width: "40px",
                    height: "40px",
                    color: "#adb5bd",
                    marginRight: "15px",
                  }}
                />
              </Link>
            )}
            <div>
              <Link href={`/applicants/details/${applicant._id}`}>
                <h4 style={{ margin: 0, color: "#212529" }}>
                  {`${applicant.prename} ${applicant.surname}`}
                </h4>
              </Link>
              <p style={{ margin: 0, color: "#6c757d" }}>
                {applicant.vacancy
                  ? vacancyTitles[applicant.vacancy] || "Loading..."
                  : "No Vacancy"}{" "}
                | Joined:{" "}
                {new Date(applicant.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantDashboard;
