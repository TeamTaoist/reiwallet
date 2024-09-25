import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        transform="translate(-281 -328) translate(281 328)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 0H24V24H0z" />
        <path
          d="M12 5.333a6.625 6.625 0 014.714 1.953A6.649 6.649 0 0118.667 12a6.625 6.625 0 01-1.953 4.714A6.649 6.649 0 0112 18.667a6.625 6.625 0 01-4.714-1.953A6.649 6.649 0 015.333 12a6.625 6.625 0 011.953-4.714A6.649 6.649 0 0112 5.333M12 4a8 8 0 100 16 8 8 0 000-16z"
          fill="#000"
          fillRule="nonzero"
        />
        <path
          d="M12.01 14.21c-.339 0-.613-.26-.613-.58 0 0-.378-4.164-.379-5.557 0-.412.444-.695.992-.695.511 0 .972.258.972.683 0 1.416-.358 5.57-.358 5.57 0 .32-.275.579-.614.579zM11.162 15.789a.833.833 0 101.667 0 .833.833 0 00-1.667 0z"
          fill="#000"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default SvgComponent;
