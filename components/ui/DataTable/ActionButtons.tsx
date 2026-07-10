"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { toast } from "sonner";

interface ActionButtonsProps {
  item: any;
  onDelete: () => void | Promise<void>;
  onEdit?: () => void;
  canDelete?: boolean;
  deleteWarning?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

export default function ActionButtons({
  item,
  onDelete,
  onEdit,
  canDelete = true,
  deleteWarning,
  size = "md",
  variant = "default"
}: ActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!canDelete) {
      toast.warning("امکان حذف این آیتم وجود ندارد");
      return;
    }

    if (deleteWarning) {
      toast.warning(deleteWarning);
    }

    toast.custom((id) => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200
        dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              تایید حذف
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              آیا از حذف {" "}
              <span className="font-semibold text-red-500">
                {item.name || item.title || `آیتم #${item.id}`}
              </span>{" "}
              مطمئن هستید؟
            </p>
            
            {deleteWarning && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200
                dark:border-yellow-800 rounded">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  ⚠️ {deleteWarning}
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await onDelete();
                  } catch (error) {
                    toast.error("خطا در حذف آیتم");
                  } finally {
                    setIsDeleting(false);
                    toast.dismiss(id);
                  }
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600
                disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف..." : "حذف"}
              </button>
              <button
                onClick={() => toast.dismiss(id)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100
                dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "top-center",
    });
  };

  const sizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-2.5 text-base"
  };

  if (variant === "compact") {
    return (
      <div className="flex gap-1">
        {onEdit && (
          <button
            onClick={onEdit}
            className={`${sizeClasses[size]} bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
              rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors`}
            title="ویرایش"
          >
            <FiEdit className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleDelete}
          disabled={!canDelete || isDeleting}
          className={`${sizeClasses[size]} ${
            canDelete 
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          } rounded-md transition-colors`}
          title={!canDelete ? "امکان حذف وجود ندارد" : "حذف"}
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
        >
          ویرایش
        </button>
      )}
      
      <button
        onClick={handleDelete}
        disabled={!canDelete || isDeleting}
        className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
          canDelete 
            ? "bg-red-500 text-white hover:bg-red-600" 
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
      >
        {isDeleting ? "حذف..." : "حذف"}
      </button>
    </div>
  );
}