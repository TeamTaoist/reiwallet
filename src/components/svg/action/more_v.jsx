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
        transform="translate(-240 -329) translate(240 329)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path d="M0 0H24V24H0z" />
        <path
          d="M12.5 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 6.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 6.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          fill="#040404"
        />
      </g>
    </svg>
  )
}

export default SvgComponent
