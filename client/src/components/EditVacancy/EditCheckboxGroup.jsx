import React from "react";
import { Radio, Typography } from "antd";

const { Title } = Typography;

const EditCheckboxGroup = ({ onChange, value }) => {
  return (
    <div style={{ width: "100%" }}>
      {/* Überschrift */}
      <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left" }}>
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
          <Radio value="Working Student">Working Student</Radio>
          <Radio value="Intern">Intern</Radio>
          <Radio value="Junior Professional">Junior Professional</Radio>
          <Radio value="Professional">Professional</Radio>
          <Radio value="Senior Professional">Senior Professional</Radio>
          <Radio value="Executive Professional">Executive Professional</Radio>
          <Radio value="Team Lead">Team Lead</Radio>
          <Radio value="Manager">Manager</Radio>
          <Radio value="Director">Director</Radio>
          <Radio value="Executive Director">Executive Director</Radio>
        </div>
      </Radio.Group>
    </div>
  );
};

export default EditCheckboxGroup;