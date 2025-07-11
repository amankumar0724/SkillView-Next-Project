"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Users, Video, Code, Headphones, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function Contact() {


  interface ContactFormData {
    name: string;
    email: string;
    company: string;
    subject: string;
    message: string;
    inquiryType: string;
}

interface EmailStatus {
    loading: boolean;
    success: boolean;
    error: string | null;
}

interface EmailTemplateParams {
    from_name: string;
    from_email: string;
    company: string;
    inquiry_type: string;
    subject: string;
    message: string;
    to_email: string;
}

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });

  const [emailStatus, setEmailStatus] = useState<EmailStatus>({
    loading: false,
    success: false,
    error: null
  });



const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

  // Email sending function using EmailJS
interface SendEmailResult {
    success: boolean;
    error?: string;
}

const sendEmail = async (
    templateParams: EmailTemplateParams
): Promise<SendEmailResult> => {
    try {
        // EmailJS configuration
        const serviceID = 'service_o4k7kdp'; // Replace with your EmailJS service ID
        const templateID = 'template_8n0uxbl'; // Replace with your EmailJS template ID
        const publicKey = 'MlZgfwE5INz85P_Ir'; // Replace with your EmailJS public key

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: serviceID,
                template_id: templateID,
                user_id: publicKey,
                template_params: templateParams
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return { success: true };
    } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Email sending error:", error);
        return { success: false, error: errorMessage };
      }

};

  // Alternative: Send email using a simple mailto approach
  const sendEmailViaMailto = () => {
    const subject = encodeURIComponent(`SkillView Contact: ${formData.subject}`);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Inquiry Type: ${formData.inquiryType}

Message:
${formData.message}
    `);
    
    window.location.href = `mailto:support@skillview.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async () => {
    // Basic form validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setEmailStatus({ 
        loading: false, 
        success: false, 
        error: 'Please fill in all required fields.' 
      });
      return;
    }

    setEmailStatus({ loading: true, success: false, error: null });

    try {
      // Prepare email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company,
        inquiry_type: formData.inquiryType,
        subject: formData.subject,
        message: formData.message,
        to_email: 'support@skillview.com' // Your receiving email
      };

      // Try sending via EmailJS first
      const result = await sendEmail(templateParams);
      
      if (result.success) {
        setEmailStatus({ loading: false, success: true, error: null });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          inquiryType: "general"
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setEmailStatus({ loading: false, success: false, error: null });
        }, 5000);
      } else {
        // Fallback to mailto
        sendEmailViaMailto();
        setEmailStatus({ loading: false, success: true, error: null });
      }
    } catch (error) {
      console.log("Failed to send email: ",error);
      setEmailStatus({ 
        loading: false, 
        success: false, 
        error: 'Failed to send email. Please try again or contact us directly.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Ready to revolutionize your hiring process? Contact our team to learn more about SkillView&apos;s virtual interview platform.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Let&apos;s Discuss Your Needs
                </h2>

                {/* Status Messages */}
                {emailStatus.success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        Message sent successfully! We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {emailStatus.error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-5 text-red-600" />
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        {emailStatus.error}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={emailStatus.loading}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed145c] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={emailStatus.loading}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed145c] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={emailStatus.loading}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed145c] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      disabled={emailStatus.loading}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed145c] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="demo">Request Demo</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="technical">Technical Support</option>
                      <option value="enterprise">Enterprise Solutions</option>
                      <option value="integration">Platform Integration</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={emailStatus.loading}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed145c] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={emailStatus.loading}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed145c] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                      placeholder="Tell us about your hiring needs, team size, or any specific requirements..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={emailStatus.loading}
                    className="w-full bg-gradient-to-r from-[#ed145c] to-[#cb3769] text-white py-3 px-6 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {emailStatus.loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions for EmailJS setup */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    📧 Email Setup Instructions:
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>1. Sign up at <a href="https://www.emailjs.com" target="_blank" className="underline">emailjs.com</a></p>
                    <p>2. Create an email service and template</p>
                    <p>3. Replace the placeholders in the code with your actual IDs</p>
                    <p>4. For now, clicking &quot;Send Message&quot; will open your default email client</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                      <p className="text-gray-600 dark:text-gray-300">support@skillview.com</p>
                      
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Phone Support</h3>
                      
                      <p className="text-gray-600 dark:text-gray-300">+1 (555) 987-6543</p>
                      
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Office Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">123 Innovation Street</p>
                      <p className="text-gray-600 dark:text-gray-300">San Francisco, CA 94105</p>
                      <p className="text-gray-600 dark:text-gray-300">United States</p>
                    </div>
                  </div>

                  
                </div>

                {/* Platform Features */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Platform Features
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <Video className="size-6 text-[#ed145c] mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        Multi-Interviewer Support
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                        Multiple interviewers can join simultaneously
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <Code className="size-6 text-[#ed145c] mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        Live Code Editor
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                        Built-in coding environment for technical assessments
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <Headphones className="size-6 text-[#ed145c] mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        HD Audio/Video
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                        Crystal clear communication during interviews
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <Users className="size-6 text-[#ed145c] mb-2" />
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        Collaborative Tools
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                        Real-time collaboration and feedback tools
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        How many interviewers can join a session?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Up to 10 interviewers can join simultaneously for comprehensive panel interviews.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        What programming languages are supported?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Currently,we support 4 programming languages including Python, JavaScript, Java, C++.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Is there a free trial available?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Yes! We offer a 14-day free trial with full access to all platform features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#ed145c] to-[#cb3769]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Hiring Process?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of companies using SkillView to conduct seamless virtual interviews with integrated coding assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
              onClick={() => window.location.href = "/"}
              className="bg-white text-[#ed145c] px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                Schedule Demo
                
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-[#ed145c] transition-colors cursor-pointer">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;