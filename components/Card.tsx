import type {ComponentProps} from 'react';

export default function Card({className = '', children, ...props}: ComponentProps<'div'>) {
    return (
        <div
          className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 ${className}`}
          {...props}
        >
          {children}
        </div>
      );
}