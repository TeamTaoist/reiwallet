import * as React from "react"

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
        transform="translate(-152 -328) matrix(0 1 1 0 152 328)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 4.88201721e-14H24V24.00000000000005H0z" />
        <g
          transform="rotate(45 1.757 16.243)"
          stroke="#000"
          strokeLinecap="round"
          strokeWidth={1.5}
        >
          <path d="M0.666666667 6L11.3333333 6" />
          <path
            transform="matrix(0 1 1 0 0 0)"
            d="M0.666666667 6L11.3333333 6"
          />
        </g>
      </g>
    </svg>
  )
}

export default SvgComponent
