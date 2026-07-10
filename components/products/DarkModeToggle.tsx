'use client';
import { useEffect, useState, FC } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle: FC = () => {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed bottom-6 left-6 p-3 bg-gray-200 dark:bg-gray-700 text-xl rounded-full shadow-lg"
      aria-label="Toggle Dark Mode"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkModeToggle;
