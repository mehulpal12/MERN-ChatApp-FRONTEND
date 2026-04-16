import React from 'react'

const Loading = () => {
  return (
    <div className='flex items-center justify-center fixed inset-0 bg-gray-900 min-h-screen'>
        <div className='h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin text-center' />
    </div>
  )
}

export default Loading