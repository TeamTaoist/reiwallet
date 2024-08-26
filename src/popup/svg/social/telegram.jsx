import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        transform="translate(-251 -150) translate(111 150) translate(140)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <circle fill="#041D12" cx={20} cy={20} r={20} />
        <path
          d="M17.425 27.598l.323-4.882 8.863-7.986c.393-.357-.08-.53-.6-.219l-10.94 6.913-4.732-1.5c-1.015-.289-1.027-.993.23-1.5L29 11.313c.842-.38 1.65.208 1.327 1.5l-3.139 14.784c-.22 1.05-.854 1.304-1.73.82l-4.779-3.532-2.296 2.227c-.266.266-.485.485-.958.485z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default SvgComponent;
