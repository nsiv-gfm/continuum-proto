import React from 'react'
export const Button = ({ className='', variant='default', size='default', ...props }) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-gray-300 hover:bg-muted",
    ghost: "hover:bg-muted",
    link: "underline underline-offset-4"
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8"
  }
  return <button className={[base, variants[variant]||variants.default, sizes[size]||sizes.default, className].join(' ')} {...props} />
}
export default Button
