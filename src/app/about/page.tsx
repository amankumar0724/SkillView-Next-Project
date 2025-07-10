import { Target, Users, Zap, Award, CheckCircle, Video, Code, Monitor } from "lucide-react";

function About() {
  return (
    <div className=" bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About SkillView
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Revolutionary virtual interview platform where multiple interviewers can simultaneously assess candidates with integrated coding challenges
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We're transforming the hiring process by creating a seamless virtual interview experience. 
                SkillView enables multiple interviewers to collaborate in real-time while candidates 
                demonstrate their technical skills through our integrated coding environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Efficient Hiring
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Streamline your recruitment process with simultaneous multi-interviewer assessments and real-time technical evaluations.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Collaborative Assessment
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Multiple interviewers can participate simultaneously, bringing diverse perspectives to candidate evaluation.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Coding
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Integrated code editor allows candidates to solve problems live while interviewers observe and provide feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Platform Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Comprehensive tools designed for modern virtual interviews with technical assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Video className="size-8 text-[#ed145c] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Multi-Interviewer Video Calls
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for multiple interviewers in a single session with high-quality video communication and screen sharing capabilities.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Code className="size-8 text-[#ed145c] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Live Code Editor
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Integrated coding environment where candidates can write, test, and debug code in real-time while interviewers observe.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Monitor className="size-8 text-[#ed145c] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Synchronized viewing and interaction tools that allow all participants to collaborate effectively during the interview.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <CheckCircle className="size-8 text-[#ed145c] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Assessment Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive evaluation features including code analysis, performance metrics, and collaborative scoring systems.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Award className="size-8 text-[#ed145c] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Interview Recording
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Record interviews for later review and analysis, including both video conversations and coding sessions.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Users className="size-8 text-[#ed145c] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Team Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Centralized dashboard for managing interviews, tracking candidates, and coordinating multiple interviewer schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Simple, streamlined process for conducting technical interviews with multiple stakeholders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Schedule Interview
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Create interview sessions and invite multiple interviewers to join simultaneously.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Conduct Interview
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Use video communication and assign coding challenges through our integrated editor.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Evaluate & Decide
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Review recordings, assess code quality, and make informed hiring decisions collaboratively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
              We're building the future of technical interviews by combining the power of collaborative 
              assessment with cutting-edge technology. Our platform bridges the gap between remote hiring 
              and in-person technical evaluations.
            </p>
            
            <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] text-white p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Ready to Transform Your Hiring Process?
              </h3>
              <p className="text-lg opacity-90">
                Join companies worldwide who are using SkillView to conduct more effective, 
                collaborative, and insightful technical interviews.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;