import React from 'react'
export function Card({ className='', ...props }) { return <div className={['rounded-2xl border bg-white', className].join(' ')} {...props} /> }
export function CardHeader({ className='', ...props }) { return <div className={['p-4 border-b', className].join(' ')} {...props} /> }
export function CardTitle({ className='', ...props }) { return <div className={['text-lg font-semibold', className].join(' ')} {...props} /> }
export function CardDescription({ className='', ...props }) { return <div className={['text-sm text-zinc-500', className].join(' ')} {...props} /> }
export function CardContent({ className='', ...props }) { return <div className={['p-4', className].join(' ')} {...props} /> }
export function CardFooter({ className='', ...props }) { return <div className={['p-4 border-t', className].join(' ')} {...props} /> }
