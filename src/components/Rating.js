import React from "react";
import "./Rating.css";

const RATINGS = [1, 2, 3, 4, 5];

function Star({ seleted = false, rating, onSelect, onHover }) {
  const className = `ratingStar ${seleted ? "selected" : ""}`;

  const handleClick = onSelect ? () => onSelect(rating) : undefined;

  const handleMouseOver = onHover ? () => onHover(rating) : undefined; //onHover = setRating
  return (
    <div className={className}>
      <span onClick={handleClick} onMouseOver={handleMouseOver}>
        ☆
      </span>
    </div>
  );
}
export default function Rating({
  className,
  value = 0,
  onSelect,
  onHover,
  onMouseOut,
}) {
  return (
    <div className={className} onMouseOut={onMouseOut}>
      {RATINGS.map((rating) => (
        <Star
          key={rating}
          seleted={value >= rating}
          rating={rating}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </div>
  );
}
