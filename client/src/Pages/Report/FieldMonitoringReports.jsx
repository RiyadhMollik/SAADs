import React from 'react'
import ChartComponent from './ChartComponent'

function FieldMonitoringReports() {
    return (
        <div>
            <div className='grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2'>
                <input type="date" className='mr-2 border w-full p-2 rounded-md shadow-md' />
                <select className='mr-2 border w-full p-2 rounded-md shadow-md'>
                    <option>option 1</option>
                    <option>option 1</option>
                    <option>option 1</option>
                </select>
                <select className='mr-2 border w-full p-2 rounded-md shadow-md'>
                    <option>option 1</option>
                    <option>option 1</option>
                    <option>option 1</option>
                </select>
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

export default FieldMonitoringReports