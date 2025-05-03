import { useState } from "react";

export default function MLModel() {
    const [file, setFile] = useState(null);

    return (
        <div className="p-6 gap-6">
            {/* Left Section */}
            <div className="flex">
                <div className="border p-6 flex-1 w-3/4">
                    <h2 className="text-lg font-bold text-center mb-4">Analysis with Machine Learning Models</h2>

                    <label className="block mb-2">Upload CSV:</label>
                    <input type="file" className="border p-2 w-full mb-4" onChange={(e) => setFile(e.target.files[0])} />

                    <label className="block mb-2">ML Models</label>
                    <select className="border p-2 w-full mb-4">
                        <option>Select ML Models</option>
                        <option>Support Vector Machine</option>
                        <option>Random Forest</option>
                        <option>XGBoost</option>
                        <option>KNN</option>
                        <option>Multi Layer Perceptron</option>
                        <option>Artifitial Neural Network</option>
                        <option>Decission Tree</option>
                        <option>LSTM</option>
                        <option>CNN</option>
                        <option>Cat Boost Regression</option>
                        <option>Ensemble</option>

                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Predicted Variable</label>
                            <select className="border p-2 w-full">
                                <option>Select Predicted Variable</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Predictor Variables</label>
                            <select className="border p-2 w-full">
                                <option>Select Predictor Variable</option>
                            </select>
                        </div>
                    </div>

                    <label className="block mt-4 mb-2">Number of Prediction Points</label>
                    <select className="border p-2 w-full mb-4">
                        <option>Select Number of Prediction Points</option>
                    </select>

                    <label className="block mb-2">Performance Matrix</label>
                    <select className="border p-2 w-full mb-4">
                        <option>Select Performance Matrices</option>
                        <option>MSE</option>
                        <option>MAE</option>
                        <option>RMSE</option>
                        <option>MAPPE</option>
                    </select>

                    <button className="w-full bg-black text-white py-2 mt-4">Submit</button>
                </div>

                {/* Right Section */}
                <div className="border p-6 w-1/4">
                    <h2 className="text-lg font-bold mb-4">Tutorial</h2>
                    <iframe
                        className="w-full h-40 mb-4"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <ul className="text-blue-600 underline mb-4">
                        <li>Input File</li>
                        <li>Output Report</li>
                        <li>Methodology</li>
                    </ul>
                    <button className="w-full bg-green-500 text-white py-2">Need Help?</button>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border p-6 flex gap-5 h-[400px]">
                <div className=" border-b pb-2 font-bold w-1/2 flex justify-between ">
                    <div>Model Prediction</div>
                    <div>CSV-PDF</div>
                </div>
                <div className="border-b pb-2 font-bold w-1/2 flex justify-between border-l px-5 ">
                    <div>Performance Matrices</div>
                    <div>CSV-PDF</div>
                </div>
            </div>
        </div>
    );
}
