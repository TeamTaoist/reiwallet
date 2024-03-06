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
        transform="translate(-463 -328) matrix(0 1 1 0 463 328) matrix(1 0 0 -1 0 24)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 0H24V24H0z" />
        <g transform="rotate(-45 17.95 .757)" stroke="#000" strokeWidth={1.2}>
          <circle cx={4.5} cy={4.5} r={3.9} />
          <path strokeLinecap="round" d="M8.5 4.5L12.5 4.5" />
        </g>
      </g>
    </svg>
  )
}

export default SvgComponent
