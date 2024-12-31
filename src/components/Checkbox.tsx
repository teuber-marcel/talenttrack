interface CheckboxProps {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  label,
  onChange,
  className='no-wrap'
}) => {
    return (
      <div
        className={className}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label style={{ marginLeft: '0.5rem' }}>{label}</label>
      </div>
    );
};

export default Checkbox;