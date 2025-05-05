import { Link } from "react-router-dom"
import { FiBookOpen, FiGithub, FiTwitter, FiMail } from "react-icons/fi"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-bold flex items-center">
              <FiBookOpen className="mr-2" /> DocShare
            </Link>
            <p className="mt-2 text-gray-400 max-w-md">
              Share documents, courses and knowledge with others easily and securely.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="text-lg font-semibold mb-4">Navigation</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/files" className="text-gray-400 hover:text-white transition">
                    Documents
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-400 hover:text-white transition">
                    Courses
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Resources</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-lg font-semibold mb-4">Contact</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FiMail className="mr-2" />
                  <a href="mailto:support@docshare.com" className="text-gray-400 hover:text-white transition">
                    support@docshare.com
                  </a>
                </li>
                <li className="flex items-center">
                  <FiGithub className="mr-2" />
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    GitHub
                  </a>
                </li>
                <li className="flex items-center">
                  <FiTwitter className="mr-2" />
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DocShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
