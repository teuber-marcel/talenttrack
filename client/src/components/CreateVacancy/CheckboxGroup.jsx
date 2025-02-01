import React, { useState } from "react";
import { Checkbox, Typography } from "antd";

const { Title } = Typography;

const CheckboxGroup = ({ onChange }) => {
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
      <Checkbox.Group onChange={handleChange} value={checkedValues} style={{ width: "100%" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          rowGap: "12px", 
          columnGap: "100px" 
        }}>
          <Checkbox value="workingStudent" style={{ color: "white" }}>Working Student</Checkbox>
          <Checkbox value="intern" style={{ color: "white" }}>Intern</Checkbox>
          <Checkbox value="juniorProfessional" style={{ color: "white" }}>Junior Professional</Checkbox>
          <Checkbox value="professional" style={{ color: "white" }}>Professional</Checkbox>
          <Checkbox value="seniorProfessional" style={{ color: "white" }}>Senior Professional</Checkbox>
          <Checkbox value="executiveProfessional" style={{ color: "white" }}>Executive Professional</Checkbox>
          <Checkbox value="teamLead" style={{ color: "white" }}>Team Lead</Checkbox>
          <Checkbox value="manager" style={{ color: "white" }}>Manager</Checkbox>
          <Checkbox value="director" style={{ color: "white" }}>Director</Checkbox>
          <Checkbox value="executiveDirector" style={{ color: "white" }}>Executive Director</Checkbox>
        </div>
      </Checkbox.Group>
    </div>
  );
};

export default CheckboxGroup;