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
        transform="translate(-181 -150) translate(111 150) translate(70)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <circle fill="#041D12" cx={20} cy={20} r={20} />
        <path
          d="M27.913 13.39a.055.055 0 00-.028-.026c-1.4-.642-2.878-1.1-4.396-1.363a.067.067 0 00-.07.034c-.202.365-.385.74-.548 1.124a16.452 16.452 0 00-4.938 0c-.165-.385-.35-.76-.556-1.124a.07.07 0 00-.071-.034c-1.519.262-2.996.72-4.397 1.363a.063.063 0 00-.029.025c-2.8 4.182-3.567 8.26-3.19 12.29.001.02.012.038.027.05a17.914 17.914 0 005.394 2.725.07.07 0 00.076-.025c.416-.566.785-1.166 1.103-1.794a.068.068 0 00-.037-.095 11.798 11.798 0 01-1.685-.803.07.07 0 01-.007-.114c.113-.085.225-.173.335-.263a.067.067 0 01.07-.01c3.534 1.614 7.361 1.614 10.855 0a.067.067 0 01.07.01c.11.09.222.178.336.263a.07.07 0 01-.006.114c-.539.315-1.103.583-1.686.802a.069.069 0 00-.037.096c.323.624.692 1.223 1.103 1.793a.068.068 0 00.076.026 17.855 17.855 0 005.402-2.725.07.07 0 00.028-.05c.45-4.657-.754-8.703-3.194-12.29zm-11.095 9.835c-1.064 0-1.941-.976-1.941-2.176 0-1.2.86-2.176 1.941-2.176 1.09 0 1.958.985 1.941 2.176 0 1.2-.86 2.176-1.94 2.176zm7.177 0c-1.064 0-1.94-.976-1.94-2.176 0-1.2.86-2.176 1.94-2.176 1.09 0 1.959.985 1.942 2.176 0 1.2-.852 2.176-1.942 2.176z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default SvgComponent;
