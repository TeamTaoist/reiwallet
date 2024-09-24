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
        transform="translate(-111 -287) translate(111 287)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 0H24V24H0z" />
        <path
          d="M12.73 10.778l3.691 3.938a1 1 0 01-.73 1.684H8.309a1 1 0 01-.73-1.684l3.692-3.938a1 1 0 011.46 0z"
          fill="#000"
          opacity={0.980612909}
          transform="matrix(1 0 0 -1 0 26.4)"
        />
      </g>
    </svg>
  );
}

export default SvgComponent;
