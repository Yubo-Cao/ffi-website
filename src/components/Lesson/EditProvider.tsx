"use client";

import { useAuth } from "@/components/Common/UserProvider";
import { createContext, useContext, useState } from "react";
import { MdEdit } from "react-icons/md";

const EditContext = createContext({
  isEditing: false,
  setIsEditing: (isEditing: boolean | ((prev: boolean) => boolean)) => {},
});

const EditProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
      {isAdmin && (
        <div className="fixed bottom-20 right-8 z-[100]">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            aria-label="edit lesson"
            className="flex size-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <div className="text-lg text-white">
              <MdEdit className="size-6" />
            </div>
          </button>
        </div>
      )}
    </EditContext.Provider>
  );
};

const useEdit = () => {
  return useContext(EditContext);
};

export { useEdit, EditProvider };
