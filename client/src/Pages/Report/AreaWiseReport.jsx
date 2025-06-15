import React from 'react'
import ChartComponent from './ChartComponent'

function AreaWiseReport() {
  return (
    <div>
        <div className='flex '>
            <input type="date"  className='mr-2 border w-full p-2 rounded-md shadow-md'/>
             <select className='mr-2 border w-full p-2 rounded-md shadow-md'>
                <option>option 1</option>
                <option>option 1</option>
                <option>option 1</option>
             </select>
        </div>
        <ChartComponent />
    </div>
  )
}

export default AreaWiseReport