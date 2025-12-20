import React from 'react';
import { Icons } from '../constants';

/***Contact Component***/
const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();

    // Validate all fields are filled
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email');
      return;
    }
    
    // Form is valid - nothing happens yet 
    console.log('Form is valid and ready to send');
    // Clear the form after successful validation
    e.target.reset();
  };

  return (
    <section 
      id="contact" 
      className="py-24 relative overflow-hidden scroll-mt-28 bg-white dark:bg-[#050505] transition-colors duration-300"
    >
      {/**Decorative Background Element**/}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-900/10 rounded-full blur-[120px] -z-10 hidden dark:block" />

      <div className="max-w-4xl mx-auto px-6">
        {/****Section Header****/}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-accent-100 dark:bg-white/5 border border-accent-200 dark:border-white/10 text-accent-700 dark:text-accent-400 text-sm font-medium mb-4">
            Let's Connect
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">Touch</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Interested in a project or collaboration ?, Let’s discuss how we can work together to achieve your goals.
          </p>
        </div>

        {/****Contact Grid - Info + Form****/}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/***Left Column - Contact Information***/}
          <div className="md:col-span-1 space-y-4">
            
            {/**Email Card**/}
            <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4">
                <Icons.Mail />
              </div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">Email</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm">ckarungu921@gmail.com</p>
            </div>
            
            {/**Phone Card**/}
            <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4">
                <Icons.Smartphone />
              </div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">Phone</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm">+243 970 509 466</p>
            </div>

            {/**Availability Card**/}
            <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4">
                <Icons.CheckCircle />
              </div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">Availability</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                Open to projects
              </p>
            </div>
          </div>

          {/***Right Column - Contact Form***/}
          <div className="md:col-span-2">
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 bg-gray-50 dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
            >
              
              {/**Name and Email Row**/}
              <div className="grid grid-cols-2 gap-4">
                
                {/*Name Field*/}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Your Name" 
                    className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
                
                {/*Email Field*/}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Your Email" 
                    className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              {/*Subject Field*/}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  Subject
                </label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  placeholder="Message Subject" 
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>

              {/*Message Field*/}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  Message
                </label>
                <textarea 
                  name="message"
                  required
                  placeholder="Your message here..." 
                  rows={4}
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                ></textarea>
              </div>

              {/*Submit Button*/}
              <button 
                type="submit" 
                className="w-full py-4 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent-600/20"
              >
                Send Message
                <Icons.Mail />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;