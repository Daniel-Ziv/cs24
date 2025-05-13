import React from 'react';

export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg relative overflow-hidden">
        {children}
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="pb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h3 className="text-xl font-bold mb-1">{children}</h3>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

export const DialogFooter = ({ children }) => (
  <div className="pt-4 flex justify-end gap-2">{children}</div>
);

export default Dialog; 