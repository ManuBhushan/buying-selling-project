// components/NotificationModal.tsx
import React from 'react';

interface NotificationModelProps {
  message: string;
  onClose: () => void;
}

export const NotificationModel: React.FC<NotificationModelProps> = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
      <p className="text-lg font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2"
      >
        Close
      </button>
    </div>
  </div>
);

