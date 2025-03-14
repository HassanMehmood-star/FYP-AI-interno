import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                We are a leading platform helping students gain real-world experience through virtual internships with top companies.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-white text-sm">Home</a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white text-sm">About</a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white text-sm">Services</a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white text-sm">Contact</a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400 text-sm mb-2">Email: info@aiinterno.com</p>
              <p className="text-gray-400 text-sm">Phone: +1 (123) 456-7890</p>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2.04C6.48 2.04 2 6.52 2 12s4.48 9.96 10 9.96c5.52 0 10-4.48 10-9.96S17.52 2.04 12 2.04zM12 18c-2.73 0-5-2.27-5-5s2.27-5 5-5 5 2.27 5 5-2.27 5-5 5zm-1-9h2v4h-2zm0 6h2v2h-2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12S5.373 0 12 0s12 5.373 12 12zm-9 0c0-1.104-.896-2-2-2h-2v4h2c1.104 0 2-1.896 2-2zm-4-2h-2v4h2zm0 6h-2v2h2zm5-2h-2v-4h-2v4h2v2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 AI-Interno. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
