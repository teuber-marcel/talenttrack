import React, { useEffect, useState } from "react";
import Sidebar from "../components/Global/Sidebar";
import BackgroundBox from "../components/Global/BackgroundBox";
import Button from "../components/Global/Button";
import { message } from "antd";
import { getApplicants } from "../services/applicantService";
import ProgressStepper from "../components/Global/ProgressStepper";

const InterviewPreparation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsData = await getApplicants();
        setApplicants(applicantsData);
      } catch (error) {
        message.error("Fehler beim Laden der Daten");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const exampleQuestions = [
    {
      question: "What is a closure in JavaScript?",
      answer: "A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope."
    },
    {
      question: "Explain the concept of prototypal inheritance in JavaScript.",
      answer: "Prototypal inheritance is a feature in JavaScript used to add methods and properties to objects. It is a method by which an object can inherit the properties and methods of another object."
    }
  ];

  const steps = [
    { title: "Job Overview", status: "finish" },
    { title: "Applicant Details", status: "finish" },
    { title: "Interview Preparation", status: "finish" }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 relative flex flex-col p-6 ${collapsed ? 'ml-12' : 'ml-56'}`}>
        <div className="absolute top-6 right-6">
          <ProgressStepper steps={steps} currentStep={0} />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-left">Interview Preparation</h1>
        <div className="flex justify-center items-center mb-4">
          {applicants.length > 0 && (
            <div className="flex flex-col items-center">
              <p className="text-center text-3xl font-bold">
                {applicants[0].prename} {applicants[0].surname}
              </p>
              <img
                src={applicants[0].photo}
                alt="Applicant photo"
                className="w-40 h-40 rounded-full"
              />
            </div>
          )}
        </div>
        <BackgroundBox>
          <p className="text-gray-600 mb-6">Job Profile: Software Developer Backend</p>
          <div className="border rounded-lg p-4 bg-white shadow-sm min-h-[200px] max-w-full overflow-y-auto">
            <pre className="whitespace-pre-wrap text-gray-800">{JSON.stringify(exampleQuestions, null, 2)}</pre>
          </div>
          <div className="flex justify-end mt-4">
            <Button label="Cancel" onClick={() => {}} className="button-secondary" />
            <Button label="Download" onClick={() => {}} className="button-primary ml-2" />
          </div>
        </BackgroundBox>
      </div>
    </div>
  );
};

export default InterviewPreparation;
