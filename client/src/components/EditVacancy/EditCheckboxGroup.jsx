import React from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const EditCheckboxGroup = ({ onChange, value }) => {
  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginBottom: 16, textAlign: "left", color: "white" }}>
        Select the hierarchy level
      </Title>

      {/* Grid für die Radio-Buttons */}
      <Radio.Group
        onChange={(e) => onChange(e.target.value)} // Direkt onChange verwenden
        value={value} // Direkt den Wert aus der übergeordneten Komponente nutzen
        style={{ width: "100%" }}
      >
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          rowGap: "12px", 
          columnGap: "50px" 
        }}>
          <Radio value="Working Student" style={{ color: "white" }}>Working Student</Radio>
          <Radio value="Intern" style={{ color: "white" }}>Intern</Radio>
          <Radio value="Junior Professional" style={{ color: "white" }}>Junior Professional</Radio>
          <Radio value="Professional" style={{ color: "white" }}>Professional</Radio>
          <Radio value="Senior Professional" style={{ color: "white" }}>Senior Professional</Radio>
          <Radio value="Executive Professional" style={{ color: "white" }}>Executive Professional</Radio>
          <Radio value="Team Lead" style={{ color: "white" }}>Team Lead</Radio>
          <Radio value="Manager" style={{ color: "white" }}>Manager</Radio>
          <Radio value="Director" style={{ color: "white" }}>Director</Radio>
          <Radio value="Executive Director" style={{ color: "white" }}>Executive Director</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default EditCheckboxGroup;