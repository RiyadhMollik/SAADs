
const TemperatureTable = ({data}) => {

  
  return (
   <div>
    
     <div className="max-w-full  w-full">
      
      <div className="overflow-x-auto border border-gray-300 rounded-lg max-h-[365px] custom-scrollbar">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Min</th>
              <th className="px-4 py-2 border-b">Max</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((data, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border-b">{data.date}</td>
                <td className="px-4 py-2 border-b">{data.min.toFixed(3)}</td>
                <td className="px-4 py-2 border-b">{data.max.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
};

export default TemperatureTable;
