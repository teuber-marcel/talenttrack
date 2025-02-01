import React, { useState } from "react";
import { Input, Typography } from "antd";

const { Title } = Typography;

const VacancyTitleInput = ({ onChange }) => {

  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value); // Wert an die Hauptkomponente senden
  };

  return (
    <div style={{
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center"
    }}>
      {/* Überschrift */}
      <Title level={4} style={{
        marginBottom: 8,
        color: "white",
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
          borderRadius: "6px"
        }}
      />
    </div>
  );
};

export default VacancyTitleInput;