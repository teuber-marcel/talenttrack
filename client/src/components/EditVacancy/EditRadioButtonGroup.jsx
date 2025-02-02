import React from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const EditRadioButtonGroup = ({ onChange, value }) => {
  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginBottom: 16, textAlign: "left", color: "white" }}>
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
          <Radio value="Accounting" style={{ color: "white" }}>Accounting</Radio>
          <Radio value="Marketing" style={{ color: "white" }}>Marketing</Radio>
          <Radio value="Finance" style={{ color: "white" }}>Finance</Radio>
          <Radio value="Production" style={{ color: "white" }}>Production</Radio>
          <Radio value="Risk & Compliance" style={{ color: "white" }}>Risk & Compliance</Radio>
          <Radio value="Project Management" style={{ color: "white" }}>Project Management</Radio>
          <Radio value="Human Resources" style={{ color: "white" }}>Human Resources</Radio>
          <Radio value="Research & Development" style={{ color: "white" }}>Research & Development</Radio>
          <Radio value="IT" style={{ color: "white" }}>IT</Radio>
          <Radio value="Sales" style={{ color: "white" }}>Sales</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default EditRadioButtonGroup;