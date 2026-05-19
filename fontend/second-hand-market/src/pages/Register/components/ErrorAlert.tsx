import React from 'react';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="w-3/4 mx-auto mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-center animate-fade-in">
      <div className="flex items-center justify-center text-red-600">
        <i className="fa fa-exclamation-circle mr-2 text-lg" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};
