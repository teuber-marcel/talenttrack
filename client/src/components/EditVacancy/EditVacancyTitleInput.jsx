import React from "react";
import { Input, Typography } from "antd";

const { Title } = Typography;

const EditVacancyTitleInput = ({ onChange, value }) => {
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
        onChange={(e) => onChange(e.target.value)} // Direkt das onChange-Prop nutzen
        value={value || ""} // Falls value undefined ist, leeren String setzen
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          background: "#fff",
          color: "#333",
          marginBottom: 0
        }}
      />
    </div>
  );
};

export default EditVacancyTitleInput;