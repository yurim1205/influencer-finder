'use client';

import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends ComponentProps<'input'> {
  label: string;
  invalid?: boolean;     // true면 라벨과 테두리를 빨갛게
  children?: ReactNode;  // 입력창 아래에 보여줄 안내 문구나 체크 칩
}

export default function Input({
  label,
  invalid = false,
  type = 'text',
  id,
  className = '',
  children,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`text-sm mb-2 block ${invalid ? 'text-red-500' : 'text-gray-800'}`}
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={invalid}
          className={`w-full px-4 py-3 border rounded-2xl text-black focus:outline-none focus:ring-2 transition-colors
            ${isPassword ? 'pr-12' : ''}
            ${invalid ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-purple-200'}
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"  // type="password"일 때만 보기/숨기기 버튼
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}