interface TextFieldMultiLineProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  name?: string;
  id?: string;
  label?: string;
  className?: string;
}

const TextFieldMultiLine: React.FC<TextFieldMultiLineProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 5,
  name,
  id,
  label,
  className='textfield-multiline'
}) => {
  return (
    <div>
      {label && id && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        name={name}
        id={id}
        className={className}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default TextFieldMultiLine;