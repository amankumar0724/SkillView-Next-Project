import Link from "next/link";
import { Airplay, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-xl font-mono hover:opacity-80 transition-opacity"
            >
              <Airplay className="size-6 text-[#ed145c]" />
              <span className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] bg-clip-text text-transparent">
                SkillView
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Virtual interview platform enabling multiple interviewers to conduct simultaneous interviews with integrated coding assessments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors">
                <Linkedin className="size-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors">
                <Github className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/interviews" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Live Interviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Platform Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Multi-Interviewer Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Live Code Editor
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Video Communication
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Real-time Collaboration
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
                  Interview Recording
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="size-4" />
                <span>support@skillview.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="size-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="size-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 SkillView. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#ed145c] transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;