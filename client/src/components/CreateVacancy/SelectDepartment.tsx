import React, { useState } from 'react';
import RadioButton from '@/components/CreateVacancy/RadioButton';

const SelectDepartment: React.FC = () => {
    const [selectedValue, setSelectedValue] = useState<string>('');
  
    const handleChange = (value: string) => {
      setSelectedValue(value);
    };
  
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Select the Department</h2>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
          <RadioButton
            label="Accounting"
            value="accounting"
            checked={selectedValue === 'accounting'}
            onChange={handleChange}
          />
          <RadioButton
            label="Finance"
            value="finance"
            checked={selectedValue === 'finance'}
            onChange={handleChange}
          />
          <RadioButton
            label="Risk & Compliance"
            value="riskAndCompliance"
            checked={selectedValue === 'riskAndCompliance'}
            onChange={handleChange}
          />
          <RadioButton
            label="Human Resource"
            value="humanResources"
            checked={selectedValue === 'humanResources'}
            onChange={handleChange}
          />
          <RadioButton
            label="IT"
            value="it"
            checked={selectedValue === 'it'}
            onChange={handleChange}
          />
          </div>
          <div style={{ flex: 1 }}>
          <RadioButton
            label="Marketing"
            value="marketing"
            checked={selectedValue === 'marketing'}
            onChange={handleChange}
          />
          <RadioButton
           label="Production"
            value="production"
            checked={selectedValue === 'production'}
            onChange={handleChange}
          />
          <RadioButton
            label="Project Management"
            value="projectManagement"
            checked={selectedValue === 'projectManagement'}
            onChange={handleChange}
          />
          <RadioButton
            label="Research & Development"
            value="researchAndDevelopment"
            checked={selectedValue === 'researchAndDevelopment'}
            onChange={handleChange}
          />
          <RadioButton
           label="Sales"
            value="sales"
            checked={selectedValue === 'sales'}
            onChange={handleChange}
          />
          </div>
        </div>
        <p>Aktuell ausgewählt: {selectedValue}</p>
      </div>
    );
};

export default SelectDepartment;