import React, { useState } from "react";
import { Checkbox, Typography } from "antd";

const { Title } = Typography;

const CheckboxGroup = ({ onChange, disabled }) => {
  const [checkedValues, setCheckedValues] = useState([]);

  const handleChange = (checkedValues) => {
    setCheckedValues(checkedValues);
    onChange(checkedValues);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginBottom: 16, textAlign: "left", color: "white" }}>
        Select the hierarchy levels
      </Title>

      {/* Grid für die Checkboxen */}
      <Checkbox.Group
        onChange={handleChange}
        value={checkedValues}
        style={{ width: "100%" }}
        disabled={disabled}
      >
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          rowGap: "12px", 
          columnGap: "100px" 
        }}>
          <Checkbox value="workingStudent" style={{ color: "white" }} disabled={disabled}>Working Student</Checkbox>
          <Checkbox value="intern" style={{ color: "white" }} disabled={disabled}>Intern</Checkbox>
          <Checkbox value="juniorProfessional" style={{ color: "white" }} disabled={disabled}>Junior Professional</Checkbox>
          <Checkbox value="professional" style={{ color: "white" }} disabled={disabled}>Professional</Checkbox>
          <Checkbox value="seniorProfessional" style={{ color: "white" }} disabled={disabled}>Senior Professional</Checkbox>
          <Checkbox value="executiveProfessional" style={{ color: "white" }} disabled={disabled}>Executive Professional</Checkbox>
          <Checkbox value="teamLead" style={{ color: "white" }} disabled={disabled}>Team Lead</Checkbox>
          <Checkbox value="manager" style={{ color: "white" }} disabled={disabled}>Manager</Checkbox>
          <Checkbox value="director" style={{ color: "white" }} disabled={disabled}>Director</Checkbox>
          <Checkbox value="executiveDirector" style={{ color: "white" }} disabled={disabled}>Executive Director</Checkbox>
        </div>
      </Checkbox.Group>
    </div>
  );
};

export default CheckboxGroup;