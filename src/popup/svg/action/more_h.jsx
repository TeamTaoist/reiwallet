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
        transform="translate(-155 -287) translate(155 287)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 0H24V24H0z" />
        <rect fill="#34332E" x={4} y={5} width={17} height={2} rx={1} />
        <rect fill="#34332E" x={8} y={11} width={13} height={2} rx={1} />
        <rect fill="#34332E" x={5} y={17} width={16} height={2} rx={1} />
      </g>
    </svg>
  );
}

export default SvgComponent;
