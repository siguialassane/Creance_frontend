// Styles et helpers pour les inputs du formulaire
// Correspond au style de l'image : bordure verte au focus, fond gris actif

export const formInputStyles = {
  primaryGreen: '#28A325',
  borderGray: '#d1d5db',
  errorRed: '#ef4444',
  errorBg: '#fef2f2',
  activeBg: '#f3f4f6',
  white: 'white',
};

export const getInputStyle = (hasError: boolean, hasValue: boolean, isFocused: boolean = false) => {
  if (hasError) {
    return {
      borderColor: formInputStyles.errorRed,
      backgroundColor: formInputStyles.errorBg,
    };
  }
  if (isFocused || hasValue) {
    return {
      borderColor: formInputStyles.primaryGreen,
      backgroundColor: formInputStyles.activeBg,
    };
  }
  return {
    borderColor: formInputStyles.borderGray,
    backgroundColor: formInputStyles.white,
  };
};

export const getInputClassName = (hasError: boolean, hasValue: boolean) => {
  const baseClasses = "w-full px-3 py-2 rounded-md border transition-colors duration-200 focus:outline-none";
  if (hasError) {
    return `${baseClasses} border-red-500 bg-red-50 focus:border-red-500`;
  }
  if (hasValue) {
    return `${baseClasses} border-[#28A325] bg-[#f3f4f6] focus:border-[#28A325]`;
  }
  return `${baseClasses} border-gray-300 bg-white focus:border-[#28A325] focus:bg-[#f3f4f6]`;
};

export const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  if (!e.target.style.borderColor.includes('red')) {
    e.target.style.borderColor = formInputStyles.primaryGreen;
    e.target.style.backgroundColor = formInputStyles.activeBg;
  }
};

export const handleInputBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  hasError: boolean = false
) => {
  if (hasError) {
    e.target.style.borderColor = formInputStyles.errorRed;
    e.target.style.backgroundColor = formInputStyles.errorBg;
  } else if (e.target.value) {
    e.target.style.borderColor = formInputStyles.primaryGreen;
    e.target.style.backgroundColor = formInputStyles.activeBg;
  } else {
    e.target.style.borderColor = formInputStyles.borderGray;
    e.target.style.backgroundColor = formInputStyles.white;
  }
};

