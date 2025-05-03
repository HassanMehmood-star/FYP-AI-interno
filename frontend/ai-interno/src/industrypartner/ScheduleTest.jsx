import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Clock, Upload } from "lucide-react";
import axios from "axios";


const ScheduleTest = () => {
  const location = useLocation();
  const { internshipId } = useParams();
  const { selectedCandidates } = location.state || {};  // Get selected candidates from state
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [internship, setInternship] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [mcqs, setMcqs] = useState([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);


  const today = format(new Date(), "yyyy-MM-dd");
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/internships/${internshipId}`);
        setInternship(response.data.internship);
      } catch (error) {
        setError("Failed to fetch internship data.");
      }
    };
    fetchInternship();
  }, [internshipId]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const handleTimeChange = (e) => setTime(e.target.value);

  const handleMcqChange = (index, field, value) => {
    const updatedMcqs = [...mcqs];
    updatedMcqs[index][field] = value;
    setMcqs(updatedMcqs);
  };

  const handleAddMcq = () => {
    setMcqs([...mcqs, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleRemoveMcq = (index) => {
    const updatedMcqs = mcqs.filter((_, i) => i !== index);
    setMcqs(updatedMcqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if MCQs are properly filled
    if (mcqs.some((mcq) => !mcq.question || mcq.options.some((option) => !option) || !mcq.correctAnswer)) {
      alert("Please complete all MCQs before submitting.");
      return;
    }
  
    const mcqData = mcqs.map((mcq) => ({
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correctAnswer,
    }));
  
    const candidateData = selectedCandidates.map((candidate) => ({
      user: candidate.userId,
      name: candidate.name,
      email: candidate.email,
    }));
  
    const industryPartnerId = internship?.createdBy?._id;
  
    try {
      const response = await axios.post("http://localhost:5000/api/schedule-test", {
        testDate: date,
        testTime: time,
        internshipId,
        candidates: JSON.stringify(candidateData),  // Stringify the candidates data
        industryPartnerId,
        mcqs: JSON.stringify(mcqData),  // Stringify the mcqs data
      });
  
      if (response.data.success) {
        setSuccessMessage("Test successfully scheduled!");
      } else {
        setError(response.data.message);  // Display error message sent from the backend
      }
    } catch (error) {
      setError("Error scheduling test. Please try again.");
    }
  };
  
  

  return (
    <div className="container mx-auto py-8 space-y-8">
      {error && <div className="bg-red-200 p-4 rounded">{error}</div>}
      {successMessage && <div className="bg-green-200 p-4 rounded">{successMessage}</div>}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Schedule Test for Internship</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">program</th>

              </tr>
            </thead>
            <tbody>
              {selectedCandidates?.map((candidate) => (
                <tr key={candidate.userId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{candidate.name}</td>
                  <td className="py-3 px-4">{candidate.email}</td>
                  <td className="py-3 px-4">{internship ? internship.title : "Loading..."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MCQ Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">MCQ Questions</h2>
        </div>
        <div className="p-6">
          {mcqs.map((mcq, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Question {index + 1}</label>
                <input
                  type="text"
                  value={mcq.question}
                  onChange={(e) => handleMcqChange(index, "question", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Options</label>
                {mcq.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...mcq.options];
                      updatedOptions[optIndex] = e.target.value;
                      handleMcqChange(index, "options", updatedOptions);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                    placeholder={`Option ${optIndex + 1}`}
                  />
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Correct Answer</label>
                <input
                  type="text"
                  value={mcq.correctAnswer}
                  onChange={(e) => handleMcqChange(index, "correctAnswer", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter the correct answer"
                />
              </div>

              {/* Remove MCQ Button */}
              {mcqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMcq(index)}
                  className="text-red-600 mt-2"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
          {/* Add More MCQs */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAddMcq}
              className="bg-teal-600 text-white py-2 px-4 rounded-md"
            >
              Add More MCQs
            </button>
          </div>
        </div>
      </div>

      {/* Test Date and Time */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Schedule Test Time</h2>
        </div>
        <div className="p-6">
        <div>
  <label className="text-sm font-medium text-gray-700">Test Date</label>
  <input
    type="date"
    value={date ? format(date, "yyyy-MM-dd") : ""}
    min={today}
    onChange={(e) => setDate(new Date(e.target.value))}
    className="w-full border border-gray-300 rounded-md px-3 py-2"
  />
</div>

          <div>
            <label className="text-sm font-medium text-gray-700">Test Time</label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
            >
              Schedule Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTest;
