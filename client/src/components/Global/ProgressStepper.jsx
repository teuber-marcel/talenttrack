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
      style={{
        width: "120%",
        display: "flex",
        justifyContent: "flex-start", // Steps nach links ausrichten
        minWidth: "100%", // Verhindert, dass sich das Layout ungleichmäßig verteilt
      }}
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
                fontSize:
                  step.status === "finish"
                    ? "1.2em"
                    : step.status === "process"
                    ? "1.1em" // Neu: Erhöhte Schriftgröße für "process"
                    : "1em",
                opacity: step.status === "process" ? 0.6 : 1,
                whiteSpace: "nowrap", // Verhindert Umbrüche innerhalb eines Schritttitels
                display: "inline-block",
                textAlign: "center",
                maxWidth: "150px", // Verhindert zu starke Dehnung der Step-Titel
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
