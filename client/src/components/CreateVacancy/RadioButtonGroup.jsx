import React, { useState } from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const RadioButtonGroup = ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginBottom: 16, textAlign: "left", color: "white" }}>
        Select the department
      </Title>

      {/* Grid für die Radio-Buttons */}
      <Radio.Group onChange={handleChange} value={selectedValue} style={{ width: "100%" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          rowGap: "12px", 
          columnGap: "50px" 
        }}>
          <Radio value="accounting" style={{ color: "white" }}>Accounting</Radio>
          <Radio value="marketing" style={{ color: "white" }}>Marketing</Radio>
          <Radio value="finance" style={{ color: "white" }}>Finance</Radio>
          <Radio value="production" style={{ color: "white" }}>Production</Radio>
          <Radio value="riskAndCompliance" style={{ color: "white" }}>Risk & Compliance</Radio>
          <Radio value="projectManagement" style={{ color: "white" }}>Project Management</Radio>
          <Radio value="humanResources" style={{ color: "white" }}>Human Resources</Radio>
          <Radio value="researchAndDevelopment" style={{ color: "white" }}>Research & Development</Radio>
          <Radio value="it" style={{ color: "white" }}>IT</Radio>
          <Radio value="sales" style={{ color: "white" }}>Sales</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default RadioButtonGroup;