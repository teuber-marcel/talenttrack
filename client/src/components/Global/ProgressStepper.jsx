import React from "react";
import { Steps } from "antd";
import "antd/dist/reset.css";

const { Step } = Steps;

const ProgressStepper = ({ steps, currentStep }) => {
  return (
    <Steps
      current={currentStep}
      size="small"
      className="custom-steps"
      progressDot={(dot, { status }) => (
        <span className={`progress-dot ${status}`}>{dot}</span>
      )}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          title={
            <span
              className={step.status === "finish" ? "step-finish" : "step-process"}
              style={{
                color: "white",
                fontWeight: step.status === "finish" ? "bold" : "normal",
                fontSize: step.status === "finish" ? "1.2em" : "1em",
                opacity: step.status === "process" ? 0.6 : 1,
              }}
            >
              {step.title}
            </span>
          }
          status={step.status}
        />
      ))}
    </Steps>
  );
};

export default ProgressStepper;

// Add this CSS in your global styles or component styles
import "../../app/globals.css";
