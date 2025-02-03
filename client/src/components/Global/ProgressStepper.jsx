import React from "react";
import { Steps } from "antd";
import "antd/dist/reset.css";
import "../../app/globals.css"; // ensure your global styles are imported

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
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        minWidth: "100%",
      }}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          title={
            <span
              className={
                step.status === "finish" ? "step-finish" : "step-process"
              }
              style={{
                // Only color changed from white to a readable dark color
                color: "#333",
                fontWeight: step.status === "finish" ? "bold" : "normal",
                fontSize:
                  step.status === "finish"
                    ? "1.2em"
                    : step.status === "process"
                      ? "1.1em"
                      : "1em",
                opacity: step.status === "process" ? 0.6 : 1,
                whiteSpace: "nowrap",
                display: "inline-block",
                textAlign: "center",
                maxWidth: "150px",
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
