import React from "react";
import type { ProfitFirstStage } from "../../../../shared/report-types";

interface StageThermometerProps {
  stage: ProfitFirstStage;
  stageProgress: number; // 0-100
  nextStageThreshold: number; // dollar amount
}

const NAVY = "#1b365d";
const GOLD = "#c5a572";

const STAGES: ProfitFirstStage[] = ["Survival", "Stability", "Growth", "Scale"];

const THRESHOLDS = ["$8,333", "$20,833", "$41,667"];

const StageThermometer: React.FC<StageThermometerProps> = ({
  stage,
  stageProgress,
}) => {
  const currentIdx = STAGES.indexOf(stage);

  return (
    <div style={{ width: "100%", padding: "8px 0" }}>
      {/* Bar track */}
      <div
        style={{
          position: "relative",
          display: "flex",
          height: 28,
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: "#e2e8f0",
        }}
      >
        {STAGES.map((s, i) => {
          const isActive = i === currentIdx;
          const isPast = i < currentIdx;
          const isFuture = i > currentIdx;

          let background = "#e2e8f0";
          if (isPast) background = NAVY;
          if (isActive) background = "transparent";
          if (isFuture) background = "#e2e8f0";

          return (
            <div
              key={s}
              style={{
                flex: 1,
                position: "relative",
                backgroundColor: background,
                borderRight:
                  i < STAGES.length - 1 ? "2px solid #f1f5f9" : "none",
              }}
            >
              {isActive && (
                <>
                  {/* Filled portion of active segment */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${stageProgress}%`,
                      backgroundColor: NAVY,
                      borderRadius:
                        stageProgress < 100 ? "0 4px 4px 0" : undefined,
                    }}
                  />
                  {/* Gold position indicator */}
                  <div
                    style={{
                      position: "absolute",
                      top: -4,
                      left: `${stageProgress}%`,
                      transform: "translateX(-50%)",
                      width: 14,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: GOLD,
                        border: "2px solid #fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage labels */}
      <div style={{ display: "flex", marginTop: 6 }}>
        {STAGES.map((s, i) => {
          const isActive = i === currentIdx;
          return (
            <div
              key={s}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? NAVY : "#94a3b8",
              }}
            >
              {s}
            </div>
          );
        })}
      </div>

      {/* Threshold markers */}
      <div style={{ display: "flex", marginTop: 2 }}>
        {STAGES.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              textAlign: "right",
              fontSize: 10,
              color: "#94a3b8",
              paddingRight: 2,
            }}
          >
            {i < THRESHOLDS.length ? THRESHOLDS[i] : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageThermometer;
