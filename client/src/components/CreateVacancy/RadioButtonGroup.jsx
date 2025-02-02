import React, { useState } from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const RadioButtonGroup = ({ onChange, disabled }) => {
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
      <Radio.Group
        onChange={handleChange}
        value={selectedValue}
        style={{ width: "100%" }}
        disabled={disabled}
      >
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          rowGap: "12px", 
          columnGap: "50px" 
        }}>
          <Radio value="Accounting" style={{ color: "white" }} disabled={disabled}>Accounting</Radio>
          <Radio value="Marketing" style={{ color: "white" }} disabled={disabled}>Marketing</Radio>
          <Radio value="Finance" style={{ color: "white" }} disabled={disabled}>Finance</Radio>
          <Radio value="Production" style={{ color: "white" }} disabled={disabled}>Production</Radio>
          <Radio value="Risk & Compliance" style={{ color: "white" }} disabled={disabled}>Risk & Compliance</Radio>
          <Radio value="Project Management" style={{ color: "white" }} disabled={disabled}>Project Management</Radio>
          <Radio value="Human Resources" style={{ color: "white" }} disabled={disabled}>Human Resources</Radio>
          <Radio value="Research & Development" style={{ color: "white" }} disabled={disabled}>Research & Development</Radio>
          <Radio value="IT" style={{ color: "white" }} disabled={disabled}>IT</Radio>
          <Radio value="Sales" style={{ color: "white" }} disabled={disabled}>Sales</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default RadioButtonGroup;