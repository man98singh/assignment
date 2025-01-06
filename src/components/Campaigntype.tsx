import { useState } from "react";
import "./css/campaigntype.css";
export const CampaignType = ({
  selectedOption,
  setSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    "Cost per Order",
    "Cost per Click",
    "Buy One Get One",
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <>
      <h1> Campaign type</h1>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-toggle">
          {selectedOption || "Select campaign type"}
        </button>
        {isOpen && (
          <ul className="dropdown-menu">
            {options.map((option, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    handleOptionClick(option);
                  }}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};
