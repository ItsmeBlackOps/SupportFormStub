import React, { useState, useCallback } from 'react';

interface AutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  onOptionSelect: (option: string) => void;
  required?: boolean;
  type?: 'text' | 'email' | 'tel';
  pattern?: string;
  className?: string;
}

export function AutocompleteInput({
  id,
  label,
  value,
  options,
  onChange,
  onOptionSelect,
  required = false,
  type = 'text',
  pattern,
  className = '',
}: AutocompleteInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!filteredOptions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedOptionIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedOptionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedOptionIndex >= 0) {
          onOptionSelect(filteredOptions[focusedOptionIndex]);
          setShowDropdown(false);
          setFocusedOptionIndex(-1);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setFocusedOptionIndex(-1);
        break;
    }
  }, [filteredOptions, focusedOptionIndex, onOptionSelect]);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        required={required}
        pattern={pattern}
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          // Delay hiding dropdown to allow click events to fire
          setTimeout(() => setShowDropdown(false), 200);
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        aria-activedescendant={
          focusedOptionIndex >= 0 ? `${id}-option-${focusedOptionIndex}` : undefined
        }
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul
          id={`${id}-listbox`}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
          role="listbox"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                index === focusedOptionIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={index === focusedOptionIndex}
              onClick={() => {
                onOptionSelect(option);
                setShowDropdown(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}