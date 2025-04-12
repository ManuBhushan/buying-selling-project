import React from "react";

interface NotificationModelProps {
  message: string;
  onClose: () => void;
}

export const NotificationModel: React.FC<NotificationModelProps> = ({
  message,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-black text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-zinc-700 transition-colors">
      <p className="text-lg font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="mt-5 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-5 py-2 transition-all"
      >
        Close
      </button>
    </div>
  </div>
);
