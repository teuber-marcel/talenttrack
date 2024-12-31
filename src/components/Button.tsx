import '@/app/globals.css';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}
  
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = 'button',
  className = 'button'
}) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={className}
      >
        {label}
      </button>
    );
};

export default Button;