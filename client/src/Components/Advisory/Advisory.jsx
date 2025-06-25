import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { IoMdPrint } from "react-icons/io";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VscLiveShare } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Advisory = ({ upazilasInDistrict, selecteddistrictName }) => {
    const [livestockContent, setLivestockContent] = useState(`
    <ul>
      <li>Move animals to shelters during storms.</li>
      <li>Provide clean water and feed early in the morning.</li>
    </ul>
  `);
    const [poultryContent, setPoultryContent] = useState(`
    <ul>
      <li>Elevate poultry houses to avoid flooding.</li>
      <li>Ensure proper ventilation and clean water.</li>
    </ul>
  `);

    const shapeNames = upazilasInDistrict.map(u => u?.properties?.shapeName);
    const shapeNamesString = shapeNames.join(", ");

    const data = [
        { name: "Jan", minTemp: 13, maxTemp: 28, rainfall: 10 },
        { name: "Feb", minTemp: 16, maxTemp: 31, rainfall: 20 },
        { name: "Mar", minTemp: 20, maxTemp: 34, rainfall: 60 },
        { name: "Apr", minTemp: 24, maxTemp: 36, rainfall: 110 },
        { name: "May", minTemp: 26, maxTemp: 37, rainfall: 200 },
        { name: "Jun", minTemp: 27, maxTemp: 36, rainfall: 400 },
        { name: "Jul", minTemp: 27, maxTemp: 35, rainfall: 500 },
        { name: "Aug", minTemp: 27, maxTemp: 35, rainfall: 450 },
        { name: "Sep", minTemp: 26, maxTemp: 34, rainfall: 350 },
        { name: "Oct", minTemp: 24, maxTemp: 33, rainfall: 180 },
        { name: "Nov", minTemp: 20, maxTemp: 31, rainfall: 50 },
        { name: "Dec", minTemp: 15, maxTemp: 29, rainfall: 10 },
    ];

    const handlePrint = () => {
        const input = document.getElementById('advisory-content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save("advisory.pdf");
            });
    };

    return (
        <div className="bg-gray-100" id="advisory-content">
            <div className="w-full bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Advisory for {new Date().toLocaleString("en-US", { month: "long" })}
                    </h2>
                    <div className="flex gap-2 text-xl text-gray-600 cursor-pointer">
                        <Link to={"/advisory-send"}>
                            <VscLiveShare />
                        </Link>
                         <IoMdPrint  onClick={handlePrint}/> 
                    </div>
                </div>

                {/* Region Info */}
                <p className="text-sm text-gray-600">
                    Climatology for {selecteddistrictName}. <br />
                    <strong>{shapeNamesString}</strong>
                </p>

                {/* Chart */}
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="rainfall" fill="#4f46e5" name="Rainfall" />
                            <Line yAxisId="right" type="monotone" dataKey="maxTemp" stroke="#ef4444" name="Max Temp" />
                            <Line yAxisId="right" type="monotone" dataKey="minTemp" stroke="#f59e0b" name="Min Temp" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Livestock Advisory */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <span className="text-blue-600">📄</span> Monthly Advisory for Livestock
                    </h3>
                    <RichTextEditor value={livestockContent} onChange={setLivestockContent} />
                </div>

                {/* Poultry Advisory */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <span className="text-yellow-500">🐓</span> Monthly Advisory for Poultry
                    </h3>
                    <RichTextEditor value={poultryContent} onChange={setPoultryContent} />
                </div>
            </div>
        </div>
    );
};

export default Advisory;
