import {
  createBrowserRouter,
} from "react-router-dom";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Main from "../Layout/Main";
import RolePerrmission from "../Pages/RolePermission/RolePerrmission";
import Role from "../Pages/Role/Role";
import User from "../Pages/Users/User";
import FarmerRegistration from "../Pages/FarmerRegistration/FarmerRegistration";
import Block from "../Pages/Block/Block";
import Upazila from "../Pages/Upazila/Upazila";
import District from "../Pages/District/District";
import Division from "../Pages/Division/Division";
import Region from "../Pages/Region/Region";
import CSA from "../Pages/CSA/CSA";
import AEZ from "../Pages/AEZ/AEZ";
import Hotspot from "../Pages/Hotspot/Hotspot";
import WeatherParameter from "../Pages/WeatherParameter/WeatherParameter";
import Protentiometer from "../Pages/Protentiometer/Protentiometer";
import WaterPotentiometer from "../Pages/WaterPotentiometer/WaterPotentiometer";
import FeedbackTable from "../Pages/FeedbackTable/FeedbackTable";
import FeedbackForm from "../Pages/FeedbackForm/FeedbackForm";
import SAAORegistration from "../Pages/SAAORegistration/SAAORegistration";
import UAORegistration from "../Pages/UAORegistration/UAORegistration";
import AdminRegistration from "../Pages/AdminRegistration/AdminRegistration";
import ADRegistration from "../Pages/ADRegistration/ADRegistration";
import WeatherForecast from "../Pages/WeatherForecast/WeatherForecast";
import Login from "../Pages/Login/Login";
import AdminProtected from "./AdminProtected";
import Laser from "../Pages/Laser/Laser";
import UltraSound from "../Pages/Ultra-Sound/UltraSound";
import About from "../Pages/About/About";
import OneFactorRCBD from "../Pages/OneFactorRCBD/OneFactorRCBD";
import AddData from "../Pages/AddData/AddData";
import Union from "../Pages/Union/Union";
import PumpControl from "../Pages/PumpControl/PumpControl";
import CIS from "../Pages/CIS/CIS";
import CISTable from "../Pages/CIS/CISTable";
import MLModel from "../Pages/MLModel/MLModel";
import Protentiometer1 from "../Pages/Protentiometer/ProtentiometerTest1";
import Report from "../Pages/Report/Report";
import UpdatePassword from "../Pages/UpdatePassword/UpdatePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminProtected> <Main /> </AdminProtected>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },  
      {
        path: "/role",
        element: <Role/>
      },  
      {
        path: "/role-permission",
        element: <RolePerrmission/>,
      },  
      {
        path: "/user",
        element: <User/>,
      },  
      {
        path: "/farmer-registration",
        element: <FarmerRegistration/>,
      },  
      {
        path: "/saao-registration",
        element: <SAAORegistration/>, 
      },  
      {
        path: "/uao-registration",
        element: <UAORegistration/>, 
      },  
      {
        path: "/admin-registration",
        element: <AdminRegistration/>, 
      },  
      {
        path: "/ad-registration",
        element: <ADRegistration/>, 
      },  
      {
        path: "/block",
        element: <Block/>,
      },  
      {
        path: "/upazila",
        element: <Upazila/>, 
      },  
      {
        path: "/district",
        element: <District/>, 
      },  
      {
        path: "/division",
        element: <Division/>, 
      },  
      {
        path: "/region",
        element: <Region/> , 
      },  
      {
        path: "/csa",
        element: <CSA/> , 
      },  
      {
        path: "/aez",
        element: <AEZ/> , 
      },  
      {
        path: "/hotspot",
        element: <Hotspot/> , 
      },  
      {
        path: "/weather-parameter",
        element: <WeatherParameter/> , 
      },  
      {
        path: "/water-lavel",
        element: <Protentiometer/> , 
      },  
      {
        path: "/water-lavel-test",
        element: <Protentiometer1/> , 
      },  
      {
        path: "/water-potentiometer",
        element: <WaterPotentiometer/> , 
      },  
      {
        path: "/feedback",
        element: <FeedbackTable/> , 
      },  
      {
        path: "/send-feedback",
        element: <FeedbackForm/> , 
      },  
      {
        path: "/weather-forecast",
        element: <WeatherForecast/> , 
      },  
      {
        path: "/crop-water",
        element: <Laser/> , 
      },  
      {
        path: "/ultra-sound",
        element: <UltraSound/> , 
      },  
      {
        path: "/about",
        element: <About/> , 
      },  
      {
        path: "/add-data",
        element: <AddData/> , 
      },  
      {
        path: "/union",
        element: <Union/> , 
      },  
      
      {
        path: "/pump-control",
        element: <PumpControl/> , 
      },  
      {
        path: "/report",
        element: <Report/> , 
      },  
      {
        path: "/update-password",
        element: <UpdatePassword/> , 
      },  
      
        
    ],
  },
  {
    path: "/login",
    element: <Login/> , 
  },
  {
    path: "/OneFactorRCBD",
    element: <OneFactorRCBD/> , 
  },  
  {
    path: "/cis",
    element: <CIS/> , 
  },  
  {
    path: "/cis-table",
    element: <CISTable/> , 
  },  
  {
    path: "/model-analysis",
    element: <MLModel/> , 
  },  
]);