import React from 'react';

interface BackgroundBoxProps {
  children: React.ReactNode;
  width?: string; // Optional width to allow customization
  height?: string; // Optional height to allow customization
}

const BackgroundBox: React.FC<BackgroundBoxProps> = ({ children, width = '100%', height = '100%' }) => {
  return (
    <div
      style={{
        backgroundColor: '#333333', // Dark gray background
        borderRadius: '15px', // Rounded corners
        padding: '20px', // Padding inside the box
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Box shadow for the card effect
        width: width, // Set width (default: 100%)
        height: height, // Set height (default: 100%)
        margin: '0 1%', // Small margin between the boxes
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Space out the items within the box
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundBox;
