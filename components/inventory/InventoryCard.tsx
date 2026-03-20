import Link from "next/link";
import React from "react";

interface InventoryCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ title, description, link, icon }) => {
  return (
    <Link href={link}>
      <div className="p-6 bg-white rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition cursor-pointer border border-gray-100">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-800">{title}</h2>
          <p className="text-slate-500 font-sans">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default InventoryCard;
