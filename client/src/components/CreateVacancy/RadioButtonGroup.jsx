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
      <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left" }}>
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
          <Radio value="Accounting" disabled={disabled}>Accounting</Radio>
          <Radio value="Marketing" disabled={disabled}>Marketing</Radio>
          <Radio value="Finance" disabled={disabled}>Finance</Radio>
          <Radio value="Production" disabled={disabled}>Production</Radio>
          <Radio value="Risk & Compliance" disabled={disabled}>Risk & Compliance</Radio>
          <Radio value="Project Management" disabled={disabled}>Project Management</Radio>
          <Radio value="Human Resources" disabled={disabled}>Human Resources</Radio>
          <Radio value="Research & Development" disabled={disabled}>Research & Development</Radio>
          <Radio value="IT" disabled={disabled}>IT</Radio>
          <Radio value="Sales" disabled={disabled}>Sales</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default RadioButtonGroup;