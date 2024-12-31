import React, { useState } from 'react';
import Checkbox from '@/components/Checkbox';

interface MultipleCheckboxState {
    workingStudent: boolean;
    intern: boolean;
    juniorProfessional: boolean;
    professional: boolean;
    seniorProfessional: boolean;
    teamLead: boolean;
    manager: boolean;
    director: boolean;
}
  
const SelectSeniorityLevel: React.FC = () => {
    // State-Objekt für mehrere Checkboxen
    const [checkboxes, setCheckboxes] = useState<MultipleCheckboxState>({
      workingStudent: false,
      intern: false,
      juniorProfessional: false,
      professional: false,
      seniorProfessional: false,
      teamLead: false,
      manager: false,
      director: false,
    });
  
    // Handler zum Aktualisieren einzelner Checkbox-Werte
    const handleCheckboxChange = (optionKey: keyof MultipleCheckboxState, checked: boolean) => {
      setCheckboxes((prev) => ({
        ...prev,
        [optionKey]: checked,
      }));
    };
  
    // Ermitteln, welche Optionen aktuell ausgewählt sind
    const selectedOptions = Object.entries(checkboxes)
      .filter(([_, isChecked]) => isChecked)
      .map(([key]) => key)
      .join(', ');
  
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Select the Seniority Level</h2>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
          <Checkbox
            checked={checkboxes.workingStudent}
            label="Working Student"
            onChange={(newChecked) => handleCheckboxChange('workingStudent', newChecked)}
          />
          <Checkbox
            checked={checkboxes.intern}
            label="Intern"
            onChange={(newChecked) => handleCheckboxChange('intern', newChecked)}
          />
          <Checkbox
            checked={checkboxes.juniorProfessional}
            label="Junior Professional"
            onChange={(newChecked) => handleCheckboxChange('juniorProfessional', newChecked)}
          />
          <Checkbox
            checked={checkboxes.professional}
            label="Professional"
            onChange={(newChecked) => handleCheckboxChange('professional', newChecked)}
          />
          </div>
          <div style={{ flex: 1 }}>
          <Checkbox
            checked={checkboxes.seniorProfessional}
            label="Senior Professional"
            onChange={(newChecked) => handleCheckboxChange('seniorProfessional', newChecked)}
          />
          <Checkbox
            checked={checkboxes.teamLead}
            label="Team Lead"
            onChange={(newChecked) => handleCheckboxChange('teamLead', newChecked)}
          />
          <Checkbox
            checked={checkboxes.manager}
            label="Manager"
            onChange={(newChecked) => handleCheckboxChange('manager', newChecked)}
          />
          <Checkbox
            checked={checkboxes.director}
            label="Director"
            onChange={(newChecked) => handleCheckboxChange('director', newChecked)}
          />
          </div>
        </div>
        <p>
          <strong>Ausgewählt:</strong> {selectedOptions || 'Keine'}
        </p>
      </div>
    );
};

export default SelectSeniorityLevel;