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
        transform="translate(-111 -150) translate(111 150)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <circle fill="#041D12" cx={20} cy={20} r={20} />
        <path
          d="M21.356 2.061a8.777 8.777 0 01-2.52.678A4.366 4.366 0 0020.761.326a8.64 8.64 0 01-2.777 1.057A4.366 4.366 0 0014.786 0a4.375 4.375 0 00-4.376 4.379c0 .338.041.677.108 1.003A12.437 12.437 0 011.494.801a4.346 4.346 0 00-.596 2.21c0 1.519.773 2.859 1.95 3.647A4.414 4.414 0 01.87 6.1v.054A4.377 4.377 0 004.38 10.45c-.367.095-.76.149-1.153.149-.285 0-.554-.028-.826-.067a4.384 4.384 0 004.09 3.036 8.771 8.771 0 01-5.433 1.871c-.367 0-.705-.012-1.057-.053a12.393 12.393 0 006.722 1.963c8.049 0 12.453-6.668 12.453-12.456 0-.19 0-.38-.013-.57a9.426 9.426 0 002.194-2.263z"
          transform="translate(9.623 12)"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  )
}

export default SvgComponent
