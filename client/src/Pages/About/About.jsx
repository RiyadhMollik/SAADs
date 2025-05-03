

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          About Intelligent Irrigation and Nutrient Management System
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          The Intelligent Irrigation and Nutrient Management System (IINMS) is designed
          to optimize water usage and nutrient distribution for agricultural fields.
          By leveraging IoT and AI, this system ensures sustainable farming practices
          while improving crop yield and resource efficiency.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Key Features:</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
          <li>Automated irrigation scheduling</li>
          <li>Real-time soil moisture monitoring</li>
          <li>Weather-based irrigation adjustments</li>
          <li>Data-driven nutrient management</li>
          <li>Remote monitoring and control</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Our Mission:</h2>
        <p className="text-gray-700 text-lg leading-relaxed mt-2">
          Our goal is to provide an intelligent and eco-friendly solution to enhance
          agricultural productivity while conserving water and nutrients. Through
          cutting-edge technology, we empower farmers to make data-driven decisions
          for better yield and sustainability.
        </p>
        
      </div>
    </div>
  );
};

export default About;
