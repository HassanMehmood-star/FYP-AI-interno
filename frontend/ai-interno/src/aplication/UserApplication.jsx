import React from 'react';
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';
import { HelpCircle } from "lucide-react"
const UserApplication = () => {
  const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const handleBackClick = () => {
      navigate('/dashboard');  // Navigates to /dashboard route
    };

  const [career, setCareer] = useState('');  // Empty by default
  const [startDate, setStartDate] = useState({ day: '', month: '', year: '' });  // Empty date fields
  const [duration, setDuration] = useState('');  // Empty by default
  const [hours, setHours] = useState('');  // Empty by default
  const [location, setLocation] = useState('');  // Empty by default

  const [preferences, setPreferences] = useState(null);


  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get('/api/getInternshipPreferences', {
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        // Set the preferences in the state
        setPreferences(response.data);

        // Optionally, populate the form fields with the fetched data
        if (response.data) {
          setCareer(response.data.career);
          setStartDate({
            day: new Date(response.data.startDate).getDate(),
            month: new Date(response.data.startDate).getMonth() + 1, // Adjust for 0-indexed months
            year: new Date(response.data.startDate).getFullYear(),
          });
          setDuration(response.data.duration);
          setHours(response.data.hours);
          setLocation(response.data.location);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, []); // Empty array means it runs only once when the component mounts


  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found');
        return;
      }

      // Validate required fields
      if (!career || !duration || !hours || !location) {
        console.error('All fields must be filled out.');
        return;
      }

      const { day, month, year } = startDate;
      if (!day || !month || !year) {
        console.error('Please provide a valid start date');
        return;
      }

      const monthZeroIndexed = parseInt(month, 10) - 1;
      const startDateFormatted = new Date(year, monthZeroIndexed, day);

      // Send data to the backend
      await axios.post(
        '/api/saveInternshipPreferences',
        {
          career,
          startDate: startDateFormatted,
          duration,
          hours,
          location,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Show success alert after saving
      setIsSuccess(true);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };
  
  
  
  
  
  
  


  return (



    
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 p-6">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr,350px] gap-6">


     

        {/* Main Content */}
        <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm">

        {isSuccess && (
  <div className="p-4 mb-4 bg-green-100 text-green-800 border border-green-200 rounded-lg flex items-center">
    <CheckCircle className="h-5 w-5 mr-2" />
    <span className="font-medium">Details submitted successfully!</span>
  </div>
)}

          {/* Step 1 */}
          <div className="bg-white p-4 rounded-lg shadow">
      {/* Card Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Step 1: Program application</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500 py-8" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {/* Card Content - Show only when expanded */}
      {isExpanded && (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-lg font-semibold">Please tell us your internship preferences</h1>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Preferred Career Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="career" className="font-medium">Preferred Career Field</label>
                </div>
                <select
                  id="career"
                  className="w-full rounded-lg border border-gray-200 p-3"
                  value={career}  // Controlled component
                  onChange={(e) => setCareer(e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Computer Science</option>
                  <option>Business & Management</option>
                  <option>Software Engineering</option>
                  <option>Healthcare & Medicine</option>
                  <option>Engineering</option>
                  <option>Arts & Design</option>
                  <option>Law</option>
                  <option>Education</option>
                  <option>Marketing & Sales</option>
                  <option>Finance & Accounting</option>
                  <option>Hospitality & Tourism</option>
                  <option>Data Science</option>
                </select>
              </div>

              {/* Preferred Internship Start Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="start-date" className="font-medium">Preferred Internship Start Date</label>
                </div>
                <div className="flex gap-2">
                <input
  id="start-day"
  type="number"
  className="w-full rounded-lg border border-gray-200 p-3"
  placeholder="Day"
  min="1"
  max="31"
  value={startDate.day}
  onChange={(e) => setStartDate({ ...startDate, day: e.target.value })}
/>
<input
  id="start-month"
  type="number"
  className="w-full rounded-lg border border-gray-200 p-3"
  placeholder="Month"
  min="1"
  max="12"
  value={startDate.month}
  onChange={(e) => setStartDate({ ...startDate, month: e.target.value })}
/>
<input
  id="start-year"
  type="number"
  className="w-full rounded-lg border border-gray-200 p-3"
  placeholder="Year"
  min="1900"
  max="9999"
  value={startDate.year}
  onChange={(e) => setStartDate({ ...startDate, year: e.target.value })}
/>

                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Internship Duration */}
              <div className="space-y-2">
                <label htmlFor="duration" className="font-medium">Internship Duration</label>
                <select
                  id="duration"
                  className="w-full rounded-lg border border-gray-200 p-3"
                  value={duration}  // Controlled component
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="">Select</option>
                  <option>2 weeks</option>
                  <option>3 weeks</option>
                  <option>4 weeks</option>
                </select>
              </div>

              {/* Weekly Committed Hours */}
              <div className="space-y-2">
                <label htmlFor="hours" className="font-medium">Weekly Committed Hours</label>
                <select
                  id="hours"
                  className="w-full rounded-lg border border-gray-200 p-3"
                  value={hours}  // Controlled component
                  onChange={(e) => setHours(e.target.value)}
                >
                  <option value="">Select</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                  <option>25</option>
                  <option>30</option>
                  <option>35</option>
                  <option>40</option>
                  <option>45</option>
                </select>
              </div>
            </div>

            {/* Your Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="font-medium">Your location during the internship</label>
              <select
  id="location"
  className="w-full rounded-lg border border-gray-200 p-3"
  value={location}  // Controlled component
  onChange={(e) => setLocation(e.target.value)}
>
  <option value="">Select</option>
  <option>Afghanistan</option>
  <option>Albania</option>
  <option>Algeria</option>
  <option>Andorra</option>
  <option>Angola</option>
  <option>Antigua and Barbuda</option>
  <option>Argentina</option>
  <option>Armenia</option>
  <option>Australia</option>
  <option>Austria</option>
  <option>Azerbaijan</option>
  <option>Bahamas</option>
  <option>Bahrain</option>
  <option>Bangladesh</option>
  <option>Barbados</option>
  <option>Belarus</option>
  <option>Belgium</option>
  <option>Belize</option>
  <option>Benin</option>
  <option>Bhutan</option>
  <option>Bolivia</option>
  <option>Bosnia and Herzegovina</option>
  <option>Botswana</option>
  <option>Brazil</option>
  <option>Brunei Darussalam</option>
  <option>Bulgaria</option>
  <option>Burkina Faso</option>
  <option>Burundi</option>
  <option>Cabo Verde</option>
  <option>Cambodia</option>
  <option>Cameroon</option>
  <option>Canada</option>
  <option>Cayman Islands</option>
  <option>Central African Republic</option>
  <option>Chad</option>
  <option>Chile</option>
  <option>China</option>
  <option>Colombia</option>
  <option>Comoros</option>
  <option>Congo (Congo-Brazzaville)</option>
  <option>Congo (Democratic Republic of the Congo)</option>
  <option>Costa Rica</option>
  <option>Cote d'Ivoire</option>
  <option>Croatia</option>
  <option>Cuba</option>
  <option>Cyprus</option>
  <option>Czech Republic</option>
  <option>Denmark</option>
  <option>Djibouti</option>
  <option>Dominica</option>
  <option>Dominican Republic</option>
  <option>Ecuador</option>
  <option>Egypt</option>
  <option>El Salvador</option>
  <option>Equatorial Guinea</option>
  <option>Eritrea</option>
  <option>Estonia</option>
  <option>Eswatini</option>
  <option>Ethiopia</option>
  <option>Fiji</option>
  <option>Finland</option>
  <option>France</option>
  <option>Gabon</option>
  <option>Gambia</option>
  <option>Georgia</option>
  <option>Germany</option>
  <option>Ghana</option>
  <option>Greece</option>
  <option>Grenada</option>
  <option>Guatemala</option>
  <option>Guinea</option>
  <option>Guinea-Bissau</option>
  <option>Guyana</option>
  <option>Haiti</option>
  <option>Honduras</option>
  <option>Hungary</option>
  <option>Iceland</option>
  <option>India</option>
  <option>Indonesia</option>
  <option>Iran</option>
  <option>Iraq</option>
  <option>Ireland</option>
  <option>Israel</option>
  <option>Italy</option>
  <option>Jamaica</option>
  <option>Japan</option>
  <option>Jordan</option>
  <option>Kazakhstan</option>
  <option>Kenya</option>
  <option>Kiribati</option>
  <option>Korea, North</option>
  <option>Korea, South</option>
  <option>Kuwait</option>
  <option>Kyrgyzstan</option>
  <option>Laos</option>
  <option>Latvia</option>
  <option>Lebanon</option>
  <option>Lesotho</option>
  <option>Liberia</option>
  <option>Libya</option>
  <option>Liechtenstein</option>
  <option>Lithuania</option>
  <option>Luxembourg</option>
  <option>Madagascar</option>
  <option>Malawi</option>
  <option>Malaysia</option>
  <option>Maldives</option>
  <option>Mali</option>
  <option>Malta</option>
  <option>Marshall Islands</option>
  <option>Mauritania</option>
  <option>Mauritius</option>
  <option>Mexico</option>
  <option>Micronesia</option>
  <option>Moldova</option>
  <option>Monaco</option>
  <option>Mongolia</option>
  <option>Montenegro</option>
  <option>Morocco</option>
  <option>Mozambique</option>
  <option>Myanmar (Burma)</option>
  <option>Namibia</option>
  <option>Nauru</option>
  <option>Nepal</option>
  <option>Netherlands</option>
  <option>New Zealand</option>
  <option>Nicaragua</option>
  <option>Niger</option>
  <option>Nigeria</option>
  <option>North Macedonia</option>
  <option>Norway</option>
  <option>Oman</option>
  <option>Pakistan</option>
  <option>Palau</option>
  <option>Panama</option>
  <option>Papua New Guinea</option>
  <option>Paraguay</option>
  <option>Peru</option>
  <option>Philippines</option>
  <option>Poland</option>
  <option>Portugal</option>
  <option>Qatar</option>
  <option>Romania</option>
  <option>Russia</option>
  <option>Rwanda</option>
  <option>Saint Kitts and Nevis</option>
  <option>Saint Lucia</option>
  <option>Saint Vincent and the Grenadines</option>
  <option>Samoa</option>
  <option>San Marino</option>
  <option>Sao Tome and Principe</option>
  <option>Saudi Arabia</option>
  <option>Senegal</option>
  <option>Serbia</option>
  <option>Seychelles</option>
  <option>Sierra Leone</option>
  <option>Singapore</option>
  <option>Slovakia</option>
  <option>Slovenia</option>
  <option>Solomon Islands</option>
  <option>Somalia</option>
  <option>South Africa</option>
  <option>South Sudan</option>
  <option>Spain</option>
  <option>Sri Lanka</option>
  <option>Sudan</option>
  <option>Suriname</option>
  <option>Svalbard</option>
  <option>Sweden</option>
  <option>Switzerland</option>
  <option>Syria</option>
  <option>Taiwan</option>
  <option>Tajikistan</option>
  <option>Tanzania</option>
  <option>Thailand</option>
  <option>Togo</option>
  <option>Tonga</option>
  <option>Trinidad and Tobago</option>
  <option>Tunisia</option>
  <option>Turkey</option>
  <option>Turkmenistan</option>
  <option>Tuvalu</option>
  <option>Uganda</option>
  <option>Ukraine</option>
  <option>United Arab Emirates</option>
  <option>United Kingdom</option>
  <option>United States</option>
  <option>Uruguay</option>
  <option>Uzbekistan</option>
  <option>Vanuatu</option>
  <option>Vatican City</option>
  <option>Venezuela</option>
  <option>Vietnam</option>
  <option>Yemen</option>
  <option>Zambia</option>
  <option>Zimbabwe</option>
</select>

            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>

          {/* Step 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold p-3">Step 2: Build your professional profile</h2>
              {/* <ChevronUp className="ml-auto h-5 w-5 text-gray-500" /> */}
            </div>

            <p className="text-gray-600 max-w-3xl p-3">
              Your profile is the key to securing your guaranteed internship. When deciding who to shortlist and
              interview, companies will review intern profiles. Here are some tips to help your profile stand out.
            </p>

            {/* New Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 shadow-md border relative">
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">Required</span>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  📩 Personal Information
                </h3>
                <p className="text-gray-600">Congratulations! You've completed this section of the application.</p>
                <Link to="/dashboard/UserApplication/PersonalInfo">
        <button className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
          Complete Details &rarr;
        </button>
      </Link>
              </div>

              {/* Education Details */}
              <div className="bg-white rounded-lg p-6 shadow-md border relative">
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">Required</span>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  🎓 Education Details
                </h3>
                <p className="text-gray-600">Congratulations! You've completed this section of the application.</p>
                <Link  to="/dashboard/UserApplication/EducationInfo">
                <button className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                  Complete Details &rarr;
                </button>
                </Link>
              </div>

              {/* Skills and Goals */}
              <div className="bg-white rounded-lg p-6 shadow-md border relative">
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">Required</span>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  🎯 Skills and Goals
                </h3>
                <p className="text-gray-600">Congratulations! You've completed this section of the application.</p>
                <Link  to="/dashboard/UserApplication/SkillsInfo">
                <button className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                  Complete Details &rarr;
                </button>
                </Link>
              </div>

              {/* Projects & Experience */}
              <div className="bg-white rounded-lg p-6 shadow-md border relative">
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">Required</span>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  💼 Projects & Past Experience
                </h3>
                <p className="text-gray-600">Congratulations! You've completed this section of the application.</p>
                <Link  to="/dashboard/UserApplication/ExperienceInfo">
                <button className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                  Complete Details &rarr;
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
      <h2 className="text-xl font-semibold">Virtual Internships</h2>
      <p className="text-gray-600">Program: Virtual Internships</p>
      <button
        onClick={handleBackClick}
        className="mt-4 w-full bg-teal-700 text-white py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors"
      >
        Back
      </button>
    </div>
        
      </div>
    </div>
  );
};

export default UserApplication;
