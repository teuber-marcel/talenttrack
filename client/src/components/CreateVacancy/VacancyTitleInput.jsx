import React, { useState } from "react";
import { Input, Typography } from "antd";

const { Title } = Typography;

const VacancyTitleInput = ({ onChange, disabled  }) => {

  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value); // Wert an die Hauptkomponente senden
  };

  return (
    <div style={{
      width: "100%",
      padding: "0px",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center"
    }}>
      {/* Überschrift */}
      <Title level={4} style={{
        marginTop: 0,
        marginBottom: 8,
        textAlign: "left",
      }}>
        Vacancy Title
      </Title>

      {/* Input-Feld */}
      <Input
        placeholder="Enter vacancy title..."
        onChange={handleChange}
        value={value}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          background: "#fff",
          color: "#333",
          marginBottom: 0
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default VacancyTitleInput;