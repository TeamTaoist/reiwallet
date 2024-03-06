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
        transform="translate(-108 -329) matrix(0 1 1 0 108 329) matrix(1 0 0 -1 0 24)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 -4.86364751e-14H24V23.99999999999995H0z" />
        <path
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.07123664 10.4477401L11.0429435 13.9064671 15.0712366 10.4477401"
        />
      </g>
    </svg>
  )
}

export default SvgComponent
