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
      <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left" }}>
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
          <Radio value="Working Student" disabled={disabled}>Working Student</Radio>
          <Radio value="Intern" disabled={disabled}>Intern</Radio>
          <Radio value="Junior Professional" disabled={disabled}>Junior Professional</Radio>
          <Radio value="Professional" disabled={disabled}>Professional</Radio>
          <Radio value="Senior Professional" disabled={disabled}>Senior Professional</Radio>
          <Radio value="Executive Professional" disabled={disabled}>Executive Professional</Radio>
          <Radio value="Team Lead" disabled={disabled}>Team Lead</Radio>
          <Radio value="Manager" disabled={disabled}>Manager</Radio>
          <Radio value="Director" disabled={disabled}>Director</Radio>
          <Radio value="Executive Director" disabled={disabled}>Executive Director</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default CheckboxGroup;