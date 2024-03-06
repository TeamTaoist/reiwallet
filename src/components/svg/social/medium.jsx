import * as React from "react"

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
        transform="translate(-321 -150) translate(111 150) translate(210)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <circle fill="#041D12" cx={20} cy={20} r={20} />
        <path
          d="M21.333 20.306c0 3.263-2.628 5.906-5.867 5.906S9.6 23.57 9.6 20.306s2.625-5.906 5.866-5.906c3.241 0 5.867 2.643 5.867 5.906m6.436 0c0 3.072-1.313 5.56-2.935 5.56-1.621 0-2.932-2.49-2.932-5.56 0-3.07 1.313-5.56 2.932-5.56 1.62 0 2.935 2.49 2.935 5.56m2.631 0c0 2.751-.462 4.982-1.032 4.982-.57 0-1.032-2.231-1.032-4.982 0-2.75.462-4.982 1.032-4.982.57 0 1.032 2.231 1.032 4.982"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  )
}

export default SvgComponent
