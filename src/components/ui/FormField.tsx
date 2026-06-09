import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'url';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  rows?: number;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  maxLength,
  error,
  hint,
  value,
  onChange,
  children,
  rows = 4,
}: FormFieldProps) {
  const inputClass = `${styles.input} ${error ? styles.hasError : ''}`;
  const textareaClass = `${styles.textarea} ${error ? styles.hasError : ''}`;

  return (
    <div className={styles.fieldWrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      {children ? (
        <div>{children}</div>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className={textareaClass}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={inputClass}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <div className={styles.footer}>
        {error ? (
          <span className={styles.error}>{error}</span>
        ) : hint ? (
          <span className={styles.hint}>{hint}</span>
        ) : null}
        {maxLength && type === 'textarea' && (
          <span className={styles.counter}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
