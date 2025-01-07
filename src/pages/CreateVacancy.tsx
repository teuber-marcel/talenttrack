import React, { useState } from 'react';
import '../app/globals.css';
import SelectDepartment from '@/components/CreateVacancy/SelectDepartment';
import SelectSeniorityLevel from '@/components/CreateVacancy/SelectSeniorityLevel';
import TextFieldMultiLine from '@/components/CreateVacancy/TextFieldMultiLine';
import Button from '@/components/Global/Button';
import NavigationBar from '@/components/Global/NavigationBar'; // Add this 

const InputVacancyTitle: React.FC = () => {
    const [vacancyTitle, setVacancyTitle] = useState<string>('');
  
    const handleTextChange = (newValue: string) => {
      setVacancyTitle(newValue);
    };
  
    return (
      <div>
        <h2>Vacancy Title</h2>
        <TextFieldMultiLine
          value={vacancyTitle}
          onChange={handleTextChange}
          placeholder="Please insert the title of the vacancy"
          rows={1}
        />
        <p>Eingegebener Wert: {vacancyTitle}</p>
      </div>
    );
};

const OutputVacancyDescription: React.FC = () => {
    const [vacancyDescription, setvacancyDescription] = useState<string>('');
  
    const handleSave = () => {
      // MERKER: HIER LOGIK ZUM SPEICHERN DER BESCHREIBUNG EINFÜGEN
    };
  
    return (
      <div>
        <h2>Description</h2>
        <TextFieldMultiLine
          value={vacancyDescription}
          onChange={setvacancyDescription}
          placeholder="Geben Sie Ihren Text hier ein..."
          rows={5}
        />
        <p>Eingegebener Wert: {vacancyDescription}</p>
      </div>
    );
};

export default function CreateVacancy() {

    const handleFirstButtonClick = () => {
        alert('Erster Button wurde geklickt!');
    };
    
      const handleSecondButtonClick = () => {
        alert('Zweiter Button wurde geklickt!');
    };

    return (
      <>
        <h1>Create Vacancy</h1>
        <div className="flex-container">
            <SelectDepartment />
            <SelectSeniorityLevel />
        </div>
        <InputVacancyTitle/>
        <OutputVacancyDescription />
        <div>
            <Button
            label="Create Vacancy"
            onClick={handleFirstButtonClick}
            className='button button-green'
            />
            <Button
            label="Cancel"
            onClick={handleSecondButtonClick}
            className='button button-red'
            />
        </div>
      </>
    );
}