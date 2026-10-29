import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
// import { devloperInfo } from "../res/String";

// Contact.tsx
export const devloperInfo = {
    name: 'Hemleen Francis',
    shortName: 'HF',
    mail: 'hemleen7@gmail.com',
    phone: "91 9629817352",
    desc: 'You can reach out to me anytime for any queries, suggestions, or support related to the projects.',
    organization: 'Developer',
    currentOrganization: 'PSG Software Technologies',
    organizationRole: 'Full Stack',
    gitLink: 'https://github.com/HEMLEEN',
    linkedIn: "https://www.linkedin.com/in/hemleen-francis-a6b144137/",
    // resumeLink: Resume

}
const Contact = () => {
    return (
        <section id="contact" className="bg-gray-900 text-white py-16 px-6 md:px-20 mt-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    Get In Touch
                </h2>
                <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                    Have a project in mind or just want to chat? I'd love to hear from you.
                    Let's create something amazing together.
                </p>
            </div>
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Left: Contact Info */}
                <div>
                    <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
                    <p className="text-gray-300 mb-8">
                        I'm always open to discussing new opportunities, interesting projects,
                        or just having a friendly chat about technology and development.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-900 p-3 rounded-full">
                                <FaEnvelope className="rounded-full" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Email</h4>
                                <p className="text-gray-300">{devloperInfo.mail}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-900 p-3 rounded-full">
                                <FaPhone className="text-xl text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Phone</h4>
                                <p className="text-gray-300">{devloperInfo.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-900 p-3 rounded-full">
                                <i className="fas fa-map-marker-alt text-xl text-white"></i>
                                <FaMapMarkerAlt className="text-xl text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Location</h4>
                                <p className="text-gray-300">Coimbatore, Tamilnadu</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="font-semibold">Response Time</h4>
                        <p className="text-gray-300">
                            I typically respond to emails within 24 hours. For urgent matters, feel free to reach out via phone.
                        </p>
                    </div>
                </div>

                {/* Right: Message Form */}
                <form className="bg-gray-800 rounded-lg p-8 space-y-6">
                    <h3 className="text-2xl font-bold">Send a Message</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200" />
                        <input type="text" placeholder="Last Name" className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    </div>
                    <input type="email" placeholder="your.email@example.com" className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    <input type="text" placeholder="What's this about?" className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    <textarea
                        rows={4}
                        placeholder="Tell me about your project or just say hello!"
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-paper-plane"></i>
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;