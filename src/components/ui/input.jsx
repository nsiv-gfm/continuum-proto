import React from 'react'
export const Input = ({ className='', ...props }) => (
  <input className={["flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className].join(' ')} {...props} />
)
export default Input
