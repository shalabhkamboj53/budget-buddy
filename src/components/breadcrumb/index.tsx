import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  button?: {
    label: string;
    onClick: () => void;
  }
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, button }) => {
  return (
    <nav className="text-lg font-medium bg-base-200 py-5 px-10 mb-6 rounded-xl flex justify-between" aria-label="Breadcrumb">
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.url ? (
              <Link
                to={item.url}
                className="text-blue-600 hover:text-blue-800"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
        {button && (
            <button onClick={button.onClick} className="text-sm btn btn-outline">{button.label}</button>
        )}
    </nav>
  );
};

export default Breadcrumb;
