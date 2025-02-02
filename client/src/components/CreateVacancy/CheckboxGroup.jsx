import React, { useState } from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const CheckboxGroup = ({ onChange, disabled }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginBottom: 16, textAlign: "left", color: "white" }}>
        Select the hierarchy level
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
          <Radio value="Working Student" style={{ color: "white" }} disabled={disabled}>Working Student</Radio>
          <Radio value="Intern" style={{ color: "white" }} disabled={disabled}>Intern</Radio>
          <Radio value="Junior Professional" style={{ color: "white" }} disabled={disabled}>Junior Professional</Radio>
          <Radio value="Professional" style={{ color: "white" }} disabled={disabled}>Professional</Radio>
          <Radio value="Senior Professional" style={{ color: "white" }} disabled={disabled}>Senior Professional</Radio>
          <Radio value="Executive Professional" style={{ color: "white" }} disabled={disabled}>Executive Professional</Radio>
          <Radio value="Team Lead" style={{ color: "white" }} disabled={disabled}>Team Lead</Radio>
          <Radio value="Manager" style={{ color: "white" }} disabled={disabled}>Manager</Radio>
          <Radio value="Director" style={{ color: "white" }} disabled={disabled}>Director</Radio>
          <Radio value="Executive Director" style={{ color: "white" }} disabled={disabled}>Executive Director</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default CheckboxGroup;