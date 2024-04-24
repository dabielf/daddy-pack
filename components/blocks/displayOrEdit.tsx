'use client';

import { createContext, useContext, forwardRef } from 'react';
import { Input } from '@/components/ui/input';

export interface DisplayOrEditProps {
  children: React.ReactNode;
  edit: boolean;
}

export const DisplayOrEditContext = createContext(false);

export function DisplayOrEdit({ children, edit = false }: DisplayOrEditProps) {
  return (
    <DisplayOrEditContext.Provider value={edit}>
      {children}
    </DisplayOrEditContext.Provider>
  );
}

export interface DisplayOrEditInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const DisplayOrEditInput = forwardRef<
  HTMLInputElement,
  DisplayOrEditInputProps
>(({ value, ...props }, ref) => {
  const edit = useContext(DisplayOrEditContext);

  if (edit) {
    return (
      <Input
        placeholder="FDUI"
        type="text"
        ref={ref}
        value={value}
        {...props}
      />
    );
  }
  return <p className="px-3 py-1 text-sm">{value || 'N/A'}</p>;
});
DisplayOrEditInput.displayName = 'DisplayOrEditInput';

export { DisplayOrEditInput };
