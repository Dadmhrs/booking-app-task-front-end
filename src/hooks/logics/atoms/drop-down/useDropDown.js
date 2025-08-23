import { useState, useRef } from 'react';
// Hooks
import { useClickOutside } from '@/hooks/custom/useClickOutside.js';

const useDropdown = ({ onChange = () => {}, onClickOutside = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    onClickOutside();
  });

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    handleSelect,
  };
};

export default useDropdown;
