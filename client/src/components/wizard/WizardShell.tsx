import React from "react";
import { WizardState, WizardStep, STEP_LABELS } from "../../hooks/useWizardState";
import StepRevenue from "./StepRevenue";
import StepBusinessModel from "./StepBusinessModel";
import StepAllocations from "./StepAllocations";
import StepFileUpload from "./StepFileUpload";

const NAVY = "#1b365d";
const GOLD = "#c5a572";

const STEPS: WizardStep[] = [1, 2, 3, 4];

interface WizardShellProps {
  wizard: WizardState;
  onSubmit: () => void;
}

export function WizardShell({ wizard, onSubmit }: WizardShellProps) {
  const { currentStep, completedSteps, next, back } = wizard;

  const handleNext = () => {
    if (currentStep === 4) {
      onSubmit();
    } else {
      next();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepRevenue wizard={wizard} />;
      case 2:
        return <StepBusinessModel wizard={wizard} />;
      case 3:
        return <StepAllocations wizard={wizard} />;
      case 4:
        return <StepFileUpload wizard={wizard} />;
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((step, idx) => {
          const isActive = step === currentStep;
          const isComplete = completedSteps.has(step);
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center" style={{ minWidth: "80px" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (isComplete || step <= currentStep) wizard.goToStep(step);
                  }}
                  className="flex items-center justify-center rounded-full font-bold text-sm transition-colors"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: isActive ? NAVY : isComplete ? GOLD : "#e5e7eb",
                    color: isActive || isComplete ? "white" : "#9ca3af",
                    border: "none",
                    cursor: isComplete || step <= currentStep ? "pointer" : "default",
                  }}
                >
                  {isComplete && !isActive ? (
                    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  ) : (
                    step
                  )}
                </button>
                <span
                  className="mt-1 text-center"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? NAVY : "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className="flex-1 mx-2"
                  style={{
                    height: "2px",
                    backgroundColor: completedSteps.has(step) ? GOLD : "#e5e7eb",
                    marginTop: "-16px",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step content */}
      <div className="mb-6">{renderStep()}</div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3" style={{ justifyContent: currentStep === 1 ? "flex-end" : "space-between" }}>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={back}
            className="px-6 py-3 rounded-md font-semibold text-sm transition-colors"
            style={{
              backgroundColor: "white",
              color: NAVY,
              border: `2px solid ${NAVY}`,
              cursor: "pointer",
            }}
          >
            Back
          </button>
        )}

        <div className="flex items-center gap-3">
          {currentStep === 3 && (
            <button
              type="button"
              onClick={next}
              className="px-6 py-3 rounded-md font-semibold text-sm transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "#888",
                border: "2px solid #e5e7eb",
                cursor: "pointer",
              }}
            >
              Skip
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 rounded-md font-bold text-sm transition-colors"
            style={{
              backgroundColor: currentStep === 4 ? GOLD : NAVY,
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: currentStep === 4 ? "0.95rem" : "0.875rem",
            }}
          >
            {currentStep === 4 ? "Run Profit First Analysis" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
