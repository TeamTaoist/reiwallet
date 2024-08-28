import * as React from "react";

const SvgComponent = (props) => (
  <svg width={48} height={48} xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>{" twitter"}</title>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h48v48H0z" />
      <path
        d="M41 13.281c-1.25.54-2.611.928-4.012 1.079a6.95 6.95 0 0 0 3.064-3.841 13.755 13.755 0 0 1-4.421 1.683A6.95 6.95 0 0 0 30.54 10a6.966 6.966 0 0 0-6.967 6.97c0 .54.065 1.08.172 1.598a19.8 19.8 0 0 1-14.367-7.293 6.918 6.918 0 0 0-.948 3.518 6.972 6.972 0 0 0 3.106 5.806 7.028 7.028 0 0 1-3.15-.886v.085a6.969 6.969 0 0 0 5.585 6.84 7.38 7.38 0 0 1-1.835.237c-.453 0-.882-.045-1.316-.106a6.98 6.98 0 0 0 6.514 4.834 13.964 13.964 0 0 1-8.65 2.979c-.585 0-1.124-.02-1.684-.086a19.73 19.73 0 0 0 10.701 3.126c12.814 0 19.826-10.616 19.826-19.83 0-.302 0-.605-.02-.907A15.007 15.007 0 0 0 41 13.281Z"
        fill="#209CF0"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

export default SvgComponent;