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
        transform="translate(-196 -329) translate(196 329)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <rect x={0} y={0} width={24} height={24} rx={6} />
        <path
          d="M14.308 17.077H6.923V9.692h7.385v7.385zm.461-8.308H6.462A.462.462 0 006 9.231v8.307c0 .255.207.462.462.462h8.307a.462.462 0 00.462-.462V9.231a.462.462 0 00-.462-.462zm-5.538 2.77H12c.308 0 .462.2.462.6 0 .4-.154.6-.462.6H9.23c-.307 0-.46-.2-.46-.6 0-.4.153-.6.46-.6zm0 2.769H12c.308 0 .462.2.462.6 0 .4-.154.6-.462.6H9.23c-.307 0-.46-.2-.46-.6 0-.4.153-.6.46-.6zM17.538 6H9.231a.462.462 0 00-.462.462v1.384h.923v-.923h7.385v8.308h-.923v.923h1.384a.462.462 0 00.462-.462v-9.23A.462.462 0 0017.538 6z"
          fill="#34332D"
          fillRule="nonzero"
        />
      </g>
    </svg>
  )
}

export default SvgComponent
