import { useState } from "react";
import { Profile } from "../components/Profile";
import { UpdatePassword } from "../components/UpdatePassword";
import { Delete } from "../components/Delete";
import { motion } from "framer-motion";
import { Settings, Lock, Trash2 } from "lucide-react";

export const Setting = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "delete">(
    "profile",
  );

  const isActive = (tab: string) =>
    activeTab === tab
      ? "bg-blue-600 text-white dark:bg-blue-500"
      : "hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="bg-white dark:bg-gray-800 shadow-md px-4 py-6 border-r border-gray-200 dark:border-gray-700 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-6 pl-2">
          Settings
        </h2>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive("profile")}`}
        >
          <Settings size={20} />
          <span>Update Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive("password")}`}
        >
          <Lock size={20} />
          <span>Update Password</span>
        </button>

        <button
          onClick={() => setActiveTab("delete")}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive("delete")}`}
        >
          <Trash2 size={20} />
          <span>Delete Account</span>
        </button>
      </aside>

      {/* Content */}
      <main className="p-4 md:p-6 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
        >
          {activeTab === "profile" && <Profile />}
          {activeTab === "password" && <UpdatePassword />}
          {activeTab === "delete" && <Delete />}
        </motion.div>
      </main>
    </div>
  );
};
