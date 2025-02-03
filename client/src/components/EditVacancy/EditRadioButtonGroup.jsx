import React from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const EditRadioButtonGroup = ({ onChange, value }) => {
  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left" }}>
        Select the department
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
          <Radio value="Accounting">Accounting</Radio>
          <Radio value="Marketing">Marketing</Radio>
          <Radio value="Finance">Finance</Radio>
          <Radio value="Production">Production</Radio>
          <Radio value="Risk & Compliance">Risk & Compliance</Radio>
          <Radio value="Project Management">Project Management</Radio>
          <Radio value="Human Resources">Human Resources</Radio>
          <Radio value="Research & Development">Research & Development</Radio>
          <Radio value="IT">IT</Radio>
          <Radio value="Sales">Sales</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default EditRadioButtonGroup;