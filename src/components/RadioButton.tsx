interface RadioButtonProps {
    checked: boolean;
    label: string;
    onChange: (value: string) => void;
    value: string;
    className?: string;
}
  
const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  label,
  onChange,
  value,
  className='no-wrap'
}) => {
    return (
      <div
        className={className}
      >
        <input
          type="radio"
          checked={checked}
          onChange={() => onChange(value)}
        />
        <label style={{ marginLeft: '0.5rem' }}>{label}</label>
      </div>
    );
};

export default RadioButton;