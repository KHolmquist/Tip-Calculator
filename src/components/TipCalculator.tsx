import React, { useState } from "react";

export default function TipCalculator() {
  const [timeAtTable, setTimeAtTable] = useState<number | "">("");
  const [numPeople, setNumPeople] = useState<number | "">("");
  const [hourlyRate, setHourlyRate] = useState(1);

  const [attentiveness, setAttentiveness] = useState(0);
  const [execution, setExecution] = useState(0);
  const [personality, setPersonality] = useState(0);

  const [bonusDiet, setBonusDiet] = useState(false);
  const [bonusDifficult, setBonusDifficult] = useState(false);
  const [bonusBeyond, setBonusBeyond] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<
    {
      baseTip: string;
      serviceBonus: string;
      bonusAddOns: string;
      suggestedTip: string;
      date: string;
    }[]
  >([]);

  const ratingDescriptions: Record<number, string> = {
    "-2": "Exceptionally poor",
    "-1": "Does not meet expectations",
    0: "Meets expectations",
    1: "Exceeds expectations",
    2: "Greatly exceeds expectations",
  };

  const criteria = {
    attentiveness: "Checks in regularly, anticipates needs",
    execution: "Timely service, correct orders, clean table",
    personality: "Friendly, respectful, calm under pressure",
  };

  // Calculations
  const baseTip =
    typeof timeAtTable === "number" &&
    timeAtTable > 0 &&
    typeof numPeople === "number" &&
    numPeople > 0
      ? ((timeAtTable / 60) * hourlyRate * numPeople).toFixed(2)
      : "0.00";

  const serviceScore = attentiveness + execution + personality;
  const serviceBonus = (serviceScore >= 0 ? serviceScore : 0).toFixed(2);

  const bonusAddOns =
    (bonusDiet ? 1 : 0) + (bonusDifficult ? 1 : 0) + (bonusBeyond ? 1 : 0);

  const suggestedTip = (
    parseFloat(baseTip) +
    parseFloat(serviceBonus) +
    bonusAddOns
  ).toFixed(2);

  const resetForm = () => {
    setTimeAtTable("");
    setNumPeople("");
    setHourlyRate(1);
    setAttentiveness(0);
    setExecution(0);
    setPersonality(0);
    setBonusDiet(false);
    setBonusDifficult(false);
    setBonusBeyond(false);
    setShowResults(false);
  };

  const handleCalculate = () => {
    if (
      typeof timeAtTable !== "number" ||
      timeAtTable <= 0 ||
      typeof numPeople !== "number" ||
      numPeople <= 0
    ) {
      alert("Please enter valid Time at table and Number of people.");
      return;
    }
    setShowResults(true);
    setHistory((prev) => [
      ...prev,
      {
        baseTip,
        serviceBonus,
        bonusAddOns: bonusAddOns.toFixed(2),
        suggestedTip,
        date: new Date().toLocaleString(),
      },
    ]);
  };

  // Style for dollar labels on slider ticks
  const sliderDollarLabels = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        color: "#555",
        marginTop: 4,
        fontFamily: "monospace",
      }}
    >
      <span>-$2</span>
      <span>-$1</span>
      <span>$0</span>
      <span>$1</span>
      <span>$2</span>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Tip Calculator</h2>

      {/* Inputs optimized for mobile: stacked with full width */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column" }}>
          Time at table (minutes):
          <input
            type="number"
            min={0}
            step={1}
            value={timeAtTable}
            placeholder="0"
            onChange={(e) =>
              setTimeAtTable(
                e.target.value === "" ? "" : Math.max(0, Number(e.target.value))
              )
            }
            style={{
              marginTop: 6,
              padding: "8px 12px",
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          Number of people:
          <input
            type="number"
            min={1}
            step={1}
            value={numPeople}
            placeholder="1"
            onChange={(e) =>
              setNumPeople(
                e.target.value === "" ? "" : Math.max(1, Number(e.target.value))
              )
            }
            style={{
              marginTop: 6,
              padding: "8px 12px",
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
          Hourly rate ($):
          <input
            type="range"
            min={0}
            max={10}
            step={0.25}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            style={{ flexGrow: 1, cursor: "pointer" }}
            aria-label="Hourly rate slider"
          />
          <span style={{ minWidth: 40, textAlign: "right", fontWeight: "bold" }}>
            ${hourlyRate.toFixed(2)}
          </span>
        </label>
      </div>

      {/* Service Ratings with dollar values */}
      <div style={{ marginBottom: 20 }}>
        <h4>Rate Service</h4>

        {/* Attentiveness */}
        <label style={{ fontWeight: "bold" }}>
          Attentiveness -{" "}
          <span style={{ fontStyle: "italic", color: "#555", fontWeight: "normal" }}>
            {criteria.attentiveness}
          </span>
        </label>
        <input
          type="range"
          min={-2}
          max={2}
          step={1}
          value={attentiveness}
          onChange={(e) => setAttentiveness(Number(e.target.value))}
          style={{ width: "100%" }}
          aria-label="Attentiveness slider"
        />
        {sliderDollarLabels}
        <div
          style={{
            textAlign: "center",
            color: "#007acc",
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          {ratingDescriptions[attentiveness]}
        </div>

        {/* Execution */}
        <label style={{ fontWeight: "bold" }}>
          Execution -{" "}
          <span style={{ fontStyle: "italic", color: "#555", fontWeight: "normal" }}>
            {criteria.execution}
          </span>
        </label>
        <input
          type="range"
          min={-2}
          max={2}
          step={1}
          value={execution}
          onChange={(e) => setExecution(Number(e.target.value))}
          style={{ width: "100%" }}
          aria-label="Execution slider"
        />
        {sliderDollarLabels}
        <div
          style={{
            textAlign: "center",
            color: "#007acc",
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          {ratingDescriptions[execution]}
        </div>

        {/* Personality */}
        <label style={{ fontWeight: "bold" }}>
          Personality -{" "}
          <span style={{ fontStyle: "italic", color: "#555", fontWeight: "normal" }}>
            {criteria.personality}
          </span>
        </label>
        <input
          type="range"
          min={-2}
          max={2}
          step={1}
          value={personality}
          onChange={(e) => setPersonality(Number(e.target.value))}
          style={{ width: "100%" }}
          aria-label="Personality slider"
        />
        {sliderDollarLabels}
        <div
          style={{
            textAlign: "center",
            color: "#007acc",
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          {ratingDescriptions[personality]}
        </div>
      </div>

      {/* Bonus Add-ons */}
      <div style={{ marginBottom: 20 }}>
        <h4>Bonus Add-ons ($1 each)</h4>
        <label style={{ display: "block", marginBottom: 6 }}>
          <input
            type="checkbox"
            checked={bonusDiet}
            onChange={(e) => setBonusDiet(e.target.checked)}
          />{" "}
          Dietary restrictions
        </label>
        <label style={{ display: "block", marginBottom: 6 }}>
          <input
            type="checkbox"
            checked={bonusDifficult}
            onChange={(e) => setBonusDifficult(e.target.checked)}
          />{" "}
          Difficult guests
        </label>
        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={bonusBeyond}
            onChange={(e) => setBonusBeyond(e.target.checked)}
          />{" "}
          Went above and beyond
        </label>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleCalculate}
          style={{
            flex: "1 1 45%",
            padding: "12px 0",
            fontSize: 16,
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Calculate Tip
        </button>
        <button
          onClick={resetForm}
          style={{
            flex: "1 1 45%",
            padding: "12px 0",
            fontSize: 16,
            backgroundColor: "#b0b0b0",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {/* Suggested Tip Breakdown */}
      {showResults && (
        <div
          style={{
            padding: 24,
            borderRadius: 10,
            backgroundColor: "rgba(0, 122, 204, 0.15)", // stronger blue background
            color: "#ffffff", // white text
            boxShadow: "0 0 10px rgba(0, 122, 204, 0.4)",
            fontWeight: "200",
          }}
          aria-live="polite"
        >
          <h3>Suggested Tip Breakdown</h3>
          <p>
            <strong>Base Tip:</strong> ${baseTip}
          </p>
          <p>
            <strong>Service Bonus (sum of ratings ≥ 0):</strong> ${serviceBonus}
          </p>
          <p>
            <strong>Bonus Add-ons:</strong> ${bonusAddOns.toFixed(2)}
          </p>
          <p style={{ fontWeight: "bold", fontSize: "1.4em" }}>
            Suggested Total Tip: ${suggestedTip}
          </p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h4>History</h4>
          <ul style={{ maxHeight: 200, overflowY: "auto", paddingLeft: 20 }}>
            {history.map((item, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <div>
                  <small style={{ color: "#666" }}>{item.date}</small>
                </div>
                <div>Base Tip: ${item.baseTip}</div>
                <div>Service Bonus: ${item.serviceBonus}</div>
                <div>Bonus Add-ons: ${item.bonusAddOns}</div>
                <div>
                  <strong>Suggested Tip: ${item.suggestedTip}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
