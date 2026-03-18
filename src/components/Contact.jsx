import { useRef, useEffect, useState } from 'react'
const bgImage = '/Images/Home Page/1-1.jpg'
const logo = '/Images/Home Page/Logo-2-150x150.png'
import { Link } from 'react-router-dom'

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    user_country: '',
    message: '',
    file: null
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const data = new FormData();
      data.append('user_name', formData.user_name);
      data.append('user_email', formData.user_email);
      data.append('user_phone', formData.user_phone);
      data.append('user_country', formData.user_country);
      data.append('message', formData.message);
      if (formData.file) {
        data.append('file', formData.file);
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setErrorMessage('');
        setFormData({
          user_name: '',
          user_email: '',
          user_phone: '',
          user_country: '',
          message: '',
          file: null
        });
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        setStatus('error');
        setErrorMessage(result.details || result.error || 'Submission failed');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('error');
      setErrorMessage(error.message || 'Network error');
    }
  };

  return (
    <div className={`w-full min-h-screen md:h-screen bg-[#0c0c0c] flex flex-col md:flex-row md:overflow-hidden font-['Forum',serif] ${isVisible ? 'is-visible' : ''}`}>
      <style>{`
        .editorial-reveal {
          opacity: 0;
          filter: blur(15px);
          transform: translateY(20px);
          transition: all 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-visible .editorial-reveal {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }
      `}</style>
      {/* Left Side - Image with Text */}
      <div className="relative w-full md:w-[50vw] lg:w-[50vw] h-[40vh] md:h-full overflow-hidden group">
        <img
          src={bgImage}
          alt="Contact Background"
          className="w-full h-full object-cover contrast-110 transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Subtle Overlay for Visibility */}
        <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50 z-10"></div>
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-8 md:p-14 lg:p-20">
          <div className="flex flex-col items-start text-left space-y-6 md:space-y-10">
            <div>
              <div className="flex items-center space-x-4 mb-4 editorial-reveal" style={{ transitionDelay: '100ms' }}>
                <span className="text-[#c29d59] tracking-[0.4em] text-[10px] md:text-xs uppercase font-light">Timeless by Design</span>
                <div className="h-[1px] w-12 bg-[#c29d59]/40"></div>
              </div>
              <h1 className="text-[#efe7d2] font-['Forum',serif] text-[clamp(2rem,5vw,3.5rem)] md:text-[clamp(3rem,6vw,5.5rem)] lg:text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.85] font-normal tracking-[-0.02em] uppercase drop-shadow-2xl editorial-reveal" style={{ transitionDelay: '300ms' }}>
                PLACE YOUR<br />
                <span className="text-[#c29d59]">CUSTOM<br />
                  ORDER</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-[50vw] lg:w-[50vw] h-auto md:h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-10 bg-[#0c0c0c] md:overflow-y-auto custom-scrollbar font-['Forum',serif]">
        <div className="w-full max-w-xl editorial-reveal" style={{ transitionDelay: '200ms' }}>
          <div className="text-center mb-8 editorial-reveal" style={{ transitionDelay: '300ms' }}>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-[1px] w-12 bg-[#efe7d2]/40"></div>
              <h2 className="text-[#efe7d2] font-['Forum',serif] text-2xl md:text-3xl tracking-[0.2em] uppercase font-normal">
                CONTACT US
              </h2>
              <div className="h-[1px] w-12 bg-[#efe7d2]/40"></div>
            </div>
            <p className="text-[#efe7d2]/60 text-xs md:text-sm font-light tracking-wide max-w-sm mx-auto leading-relaxed font-['Forum',serif]">
              To customize anything from us, please fill out this form. Write the basic requirements you want and we will get back to you within 24 hours.
            </p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="flex flex-col space-y-1.5 editorial-reveal" style={{ transitionDelay: '400ms' }}>
              <label className="text-[#efe7d2]/80 text-[10px] tracking-[0.2em] font-['Forum',serif] uppercase">Name <span className="text-red-500">*</span></label>
              <input
                required
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-[#efe7d2] placeholder-[#efe7d2]/20 focus:outline-none focus:border-[#c29d59]/50 transition-all font-['Forum',serif] text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-1.5 editorial-reveal" style={{ transitionDelay: '500ms' }}>
              <label className="text-[#efe7d2]/80 text-[11px] tracking-[0.15em] font-['Forum',serif] uppercase">Email <span className="text-red-500">*</span></label>
              <input
                required
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-[#efe7d2] placeholder-[#efe7d2]/20 focus:outline-none focus:border-[#c29d59]/50 transition-all font-['Forum',serif] text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col space-y-1.5 editorial-reveal" style={{ transitionDelay: '600ms' }}>
              <label className="text-[#efe7d2]/80 text-[11px] tracking-[0.15em] font-['Forum',serif] uppercase">Phone Number <span className="text-red-500">*</span></label>
              <input
                required
                name="user_phone"
                value={formData.user_phone}
                onChange={handleChange}
                type="tel"
                placeholder="+91 980...."
                className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-[#efe7d2] placeholder-[#efe7d2]/20 focus:outline-none focus:border-[#c29d59]/50 transition-all font-['Forum',serif] text-sm"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col space-y-1.5 editorial-reveal" style={{ transitionDelay: '700ms' }}>
              <label className="text-[#efe7d2]/80 text-[11px] tracking-[0.15em] font-['Forum',serif] uppercase">Country</label>
              <input
                name="user_country"
                value={formData.user_country}
                onChange={handleChange}
                type="text"
                placeholder="India"
                className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-[#efe7d2] placeholder-[#efe7d2]/20 focus:outline-none focus:border-[#c29d59]/50 transition-all font-['Forum',serif] text-sm"
              />
            </div>

            {/* File Upload (Optional handling can be added later) */}
            <div className="flex flex-col space-y-1.5 md:col-span-2 editorial-reveal" style={{ transitionDelay: '800ms' }}>
              <label className="text-[#efe7d2]/80 text-[11px] tracking-[0.15em] font-['Forum',serif] uppercase">Upload File (PDF, PNG, JPG - Max 10MB)</label>
              <div className="relative">
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 10 * 1024 * 1024) {
                      alert("File size exceeds 10MB limit.");
                      e.target.value = "";
                      setFormData(prev => ({ ...prev, file: null }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-[#efe7d2] font-['Forum',serif] cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-['Forum',serif] file:bg-[#c29d59]/20 file:text-[#c29d59] hover:file:bg-[#c29d59]/30 transition-all text-sm"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col space-y-1.5 md:col-span-2 editorial-reveal" style={{ transitionDelay: '900ms' }}>
              <label className="text-[#efe7d2]/80 text-[11px] tracking-[0.15em] font-['Forum',serif] uppercase">Tell us what you want? <span className="text-red-500">*</span></label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="I need a custom artifact"
                className="bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-[#efe7d2] placeholder-[#efe7d2]/20 focus:outline-none focus:border-[#c29d59]/50 transition-all font-['Forum',serif] text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2 editorial-reveal" style={{ transitionDelay: '1000ms' }}>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full ${status === 'sending' ? 'bg-gray-800 cursor-not-allowed' : 'bg-[#1a1a1a] border-[#c29d59]/30 hover:bg-[#c29d59]/10 hover:border-[#c29d59]'} border text-[#efe7d2] py-3.5 rounded-lg tracking-[0.3em] font-['Forum',serif] text-[10px] md:text-sm transition-all duration-300 active:scale-95 uppercase shadow-lg`}
              >
                {status === 'sending' ? 'SENDING INQUIRY...' : status === 'success' ? 'INQUIRY SENT!' : 'SUBMIT THE CUSTOM ASK'}
              </button>

              {status === 'success' && (
                <p className="text-[#c29d59] text-center mt-4 text-sm animate-pulse">Thank you! We will get back to you shortly.</p>
              )}
              {status === 'error' && (
                <div className="text-red-500 text-center mt-4 text-xs space-y-1">
                  <p>Oops! Something went wrong.</p>
                  <p className="font-bold text-[10px] uppercase tracking-wider">{errorMessage}</p>
                  <p className="opacity-70 text-[10px]">Note: Email delivery only works in production (e.g., Vercel) as local Vite doesn't run the API folder.</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}

export default Contact
