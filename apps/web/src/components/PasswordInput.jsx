import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ className, style, wrapperStyle, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', ...wrapperStyle }}>
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={className}
        style={{ paddingRight: 38, width: '100%', ...style }}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'inherit', opacity: 0.45, padding: 2,
          display: 'flex', alignItems: 'center',
        }}
        aria-label={show ? 'Ocultar contraseña' : 'Ver contraseña'}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
