import { ChevronDown } from 'lucide-react';

//Hooks
import useDropdown from '@/hooks/logics/atoms/drop-down/useDropDown.js';

const Dropdown = ({
  options = [],
  value = '',
  onChange = () => {},
  placeholder = 'Select an option...',
  className = '',
  onClickOutside = () => {},
}) => {
  const { isOpen, setIsOpen, dropdownRef, handleSelect } = useDropdown({
    onChange,
    onClickOutside,
  });

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border-2 border-blue-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between group"
      >
        <span
          className={`${
            value ? 'text-gray-800' : 'text-gray-500'
          } font-medium truncate`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-all duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute z-50 mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-xl max-h-60 overflow-y-auto w-[calc(100vw-2rem)] sm:w-full max-w-[var(--radix-dropdown-menu-content-available-width)]">
          {options.length > 0 ? (
            options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-blue-100 last:border-b-0 font-medium text-gray-700 hover:text-blue-800 first:rounded-t-xl last:rounded-b-xl"
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center font-medium">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
