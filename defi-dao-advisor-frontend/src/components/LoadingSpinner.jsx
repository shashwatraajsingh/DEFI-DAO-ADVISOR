
import React from 'react'

const LoadingSpinner = ({ className = "h-8 w-8", color = "border-t-Web3-400" }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 ${color} ${className}`}></div>
  )
}

export default LoadingSpinner
