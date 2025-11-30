import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, ArrowDown, Mail, Instagram, Twitter, Linkedin, ExternalLink, Smartphone, Zap, Monitor, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import LiquidBackground from './components/LiquidBackground';
import ProjectCard from './components/ProjectCard';
import AIChat from './components/AIChat';
import { Project } from './types';

// Helper to extract Drive File ID
const getDriveId = (url: string) => {
  const match = url.match(/\/file\/d\/([^\/]+)/);
  return match ? match[1] : null;
};

// Helper to generate Thumbnail URL
const getThumbnailUrl = (url: string) => {
  const id = getDriveId(url);
  if (!id) return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'; // Fallback
  // Requesting a large thumbnail (w1280)
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1280`;
};

// Helper to extract ID and convert to direct stream URL for video tag
const getStreamUrl = (url: string | undefined) => {
  if (!url) return '';
  const id = getDriveId(url);
  if (id) {
    // Uses the export=download endpoint which allows direct streaming in <video> tags
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
};

// Ravish's Portfolio Data
// Using the provided Drive links to generate thumbnails and video URLs
const projects: Project[] = [
  {
    id: 1,
    title: "Tech & AI Showcase",
    category: "Tech/Educational",
    image: getThumbnailUrl("https://drive.google.com/file/d/1tjidVKFgzdpyr05nIpMrMLIQiwB6VS7X/view?usp=drivesdk"),
    description: "High-retention editing style optimized for technology and AI narratives. Features smooth motion graphics and clear storytelling.",
    color: "from-blue-500 to-cyan-600",
    videoUrl: "https://drive.google.com/file/d/1tjidVKFgzdpyr05nIpMrMLIQiwB6VS7X/view?usp=drivesdk"
  },
  {
    id: 2,
    title: "Challenge Video",
    category: "Challenge",
    image: getThumbnailUrl("https://drive.google.com/file/d/1IfwdaC4z91jvoEoRdsXS4h9nf_n-3Viu/view?usp=drivesdk"),
    description: "Educational content edited for maximum clarity. Uses clean cuts and modern minimal graphics to keep viewers engaged.",
    color: "from-purple-500 to-indigo-600",
    videoUrl: "https://drive.google.com/file/d/1IfwdaC4z91jvoEoRdsXS4h9nf_n-3Viu/view?usp=drivesdk"
  },
  {
    id: 3,
    title: "Narrative Flow",
    category: "Storytelling",
    image: getThumbnailUrl("https://drive.google.com/file/d/1QEWKJ9oH11EH0XIoTEWy1zxYhaOZLGoo/view?usp=drivesdk"),
    description: "Focused on the 8-10 second engagement cycle. This edit demonstrates improved watch-time techniques and pacing.",
    color: "from-emerald-500 to-green-600",
    videoUrl: "https://drive.google.com/file/d/1QEWKJ9oH11EH0XIoTEWy1zxYhaOZLGoo/view?usp=drivesdk"
  },
  {
    id: 4,
    title: "Mobile Motion",
    category: "Motion Graphics",
    image: getThumbnailUrl("https://drive.google.com/file/d/1j9uWrIdCZBohBLKgUuv5PfpoEu-aPsp4/view?usp=drivesdk"),
    description: "Advanced motion graphics created using mobile tools like Alight Motion and CapCut. Proving mobile editing can be pro.",
    color: "from-orange-500 to-red-600",
    videoUrl: "https://drive.google.com/file/d/1j9uWrIdCZBohBLKgUuv5PfpoEu-aPsp4/view?usp=drivesdk"
  },
  {
    id: 5,
    title: "Shorts & Reels",
    category: "Vertical Video",
    image: getThumbnailUrl("https://drive.google.com/file/d/1KXTY9tTHm4p-d-lz2uQ8vh2kBTdPux7u/view?usp=drivesdk"),
    description: "Fast-paced vertical content designed for Instagram Reels and TikTok. Brand-consistent colors and fonts.",
    color: "from-pink-500 to-rose-600",
    videoUrl: "https://drive.google.com/file/d/1KXTY9tTHm4p-d-lz2uQ8vh2kBTdPux7u/view?usp=drivesdk"
  }
];

const App: React.FC = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Reset video state when project changes
  useEffect(() => {
    if (!selectedProject) {
      setIsPlaying(false);
      setIsVideoLoaded(false);
      setVideoError(false);
    }
  }, [selectedProject]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500 selection:text-white">
      <LiquidBackground />
      
      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-black/30 backdrop-blur-md border-white/10 py-4 px-6 md:px-10' 
            : 'bg-transparent border-transparent py-6 px-6 md:px-10'
        }`}
      >
        <a 
          href="#" 
          onClick={(e) => scrollToSection(e, 'top')} 
          className="text-2xl font-bold tracking-tighter"
        >
          RAVISH.
        </a>
        <motion.div 
          className="flex gap-6 text-sm font-medium tracking-wide"
          animate={{
            opacity: isScrolled ? 0.7 : 1,
            scale: isScrolled ? 0.95 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <a 
            href="#work" 
            onClick={(e) => scrollToSection(e, 'work')} 
            className="hover:text-blue-400 transition-colors"
          >
            WORK
          </a>
          <a 
            href="#about" 
            onClick={(e) => scrollToSection(e, 'about')} 
            className="hover:text-blue-400 transition-colors"
          >
            ABOUT
          </a>
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, 'contact')} 
            className="hover:text-blue-400 transition-colors"
          >
            CONTACT
          </a>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 max-w-5xl"
        >
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="mb-4 inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-blue-300">Video Editor</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
          >
            Ravish.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Specializing in Tech, AI, and Educational content.
            <br />
            Clean motion graphics, high-retention storytelling.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
          <ArrowDown className="animate-bounce" />
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="relative z-20 px-4 py-24 md:px-10 lg:px-20 max-w-[1600px] mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Work</h2>
          <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
          <p className="mt-4 text-gray-400">Examples of my best edited videos.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={setSelectedProject} 
              className={index < 3 ? "aspect-video" : "aspect-[4/5]"}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-20 py-32 px-4 bg-black/20 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Column: Bio & Tools */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-500 font-medium tracking-wider uppercase mb-2 block"
            >
              About Me
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Editing with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">impact</span>.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-300 leading-relaxed mb-6"
            >
              I’m a video editor specializing in Tech, AI, Tutorials & Educational content.
              I create clean, modern, high-retention edits with smooth motion graphics, storytelling flow,
              and consistent branding.
            </motion.p>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="text-lg text-gray-300 leading-relaxed mb-8"
            >
              Focused on helping creators grow with quality and watch-time-optimized videos.
            </motion.p>
            
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl font-bold mb-4 flex items-center gap-2"
            >
              <Smartphone className="w-5 h-5 text-blue-400" />
              Software & Tools
            </motion.h3>
            
            <motion.div 
              className="flex flex-wrap gap-2 mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.6
                  }
                }
              }}
            >
              {['Alight Motion', 'CapCut', 'Adobe Podcast', 'Gemini AI', 'ChatGPT'].map((tool) => (
                <motion.span 
                  key={tool} 
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 10 },
                    visible: { opacity: 1, scale: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm cursor-default transition-colors"
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4"
             >
              <div className="px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Available for work</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Services & Differentiators */}
          <div className="space-y-12">
            
            {/* Services */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Monitor className="w-6 h-6 text-purple-400" />
                Services I Provide
              </h3>
              <motion.ul 
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.4
                    }
                  }
                }}
              >
                {[
                  'Long-form editing (YouTube/Educational)',
                  'Reels/Shorts creation (Vertical)',
                  'Custom intro & outro animation',
                  'Consistent branding setup'
                ].map((service, i) => (
                  <motion.li 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                    {service}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

             {/* Differentiators */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                Why Choose Me?
              </h3>
              <motion.ul 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.6
                    }
                  }
                }}
              >
                 {[
                  'Niche-based editing (Tech/AI style)',
                  '8–10 sec engagement cycle',
                  'Clean + modern minimal graphics',
                  'Brand-consistent colors & fonts',
                  'Improved watch-time editing',
                  'Client-friendly communication'
                ].map((item, i) => (
                   <motion.li 
                      key={i} 
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      className="flex items-start gap-3 text-gray-300 text-sm"
                    >
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-yellow-500 flex-shrink-0"></span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-20 py-32 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's create together.</h2>
          <p className="text-xl text-gray-400 mb-12">
            Ready to upgrade your content? Reach out via Email or WhatsApp.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="mailto:ravishbusiness22@gmail.com" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
              Email Me
            </a>
            <a href="https://wa.me/919259338002" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
          
          <div className="mt-8 text-gray-500">
             <p>ravishbusiness22@gmail.com</p>
             <p>+91 9259338002</p>
          </div>

          <div className="mt-16 flex justify-center gap-8 text-white/40">
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-6 h-6" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
          </div>
        </div>
        
        <footer className="mt-32 text-sm text-gray-600">
          © {new Date().getFullYear()} Ravish Portfolio. All rights reserved.
        </footer>
      </section>

      {/* Project Modal/Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              layoutId={`project-${selectedProject.id}`}
              className="bg-neutral-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-black group overflow-hidden">
                {!isPlaying ? (
                  <>
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      onError={(e) => {
                        // Fallback if Drive thumbnail doesn't load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.fallback-gradient')?.classList.remove('opacity-20');
                        e.currentTarget.parentElement?.querySelector('.fallback-gradient')?.classList.add('opacity-100');
                      }}
                      className="w-full h-full object-cover opacity-60" 
                    />
                    {/* Gradient fallback layer in case image fails */}
                    <div className={`fallback-gradient absolute inset-0 -z-10 bg-gradient-to-br ${selectedProject.color} opacity-20`}></div>
                    
                    {/* Center Action Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <button 
                        onClick={handlePlayClick}
                        className="group-hover:scale-110 transition-transform duration-300"
                      >
                         <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">
                           <Play className="w-8 h-8 ml-1 text-black group-hover:text-white" />
                         </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full relative bg-zinc-950 flex flex-col justify-center">
                    {/* Loading State */}
                    {!isVideoLoaded && !videoError && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900/50">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                      </div>
                    )}

                    {/* Error State */}
                    {videoError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-30 p-6 text-center">
                         <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                         <p className="text-white font-medium mb-1">Playback unavailable inline</p>
                         <p className="text-gray-400 text-sm mb-4">The file might be private or restricted by Google Drive.</p>
                         <a 
                            href={selectedProject.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
                          >
                            Open in Google Drive
                          </a>
                      </div>
                    )}

                    {/* Native Video Element - Direct Stream */}
                    <video 
                      src={getStreamUrl(selectedProject.videoUrl)} 
                      className={`w-full h-full object-contain ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                      controls
                      autoPlay
                      playsInline
                      onCanPlay={() => setIsVideoLoaded(true)}
                      onError={() => {
                        setVideoError(true);
                        setIsVideoLoaded(true); // Stop loader
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="p-8 md:p-12">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex justify-between items-start mb-6"
                >
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-2">{selectedProject.title}</h3>
                    <p className="text-blue-400 font-medium text-lg">{selectedProject.category}</p>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ExternalLink className="w-6 h-6" />
                  </button>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-gray-300 text-lg leading-relaxed mb-6"
                >
                  {selectedProject.description}
                </motion.p>
                
                {selectedProject.videoUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <a 
                      href={selectedProject.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                      Open in Drive <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center"
                >
                  <div>
                    <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Role</span>
                    <span className="font-medium">Video Editor</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Softwares</span>
                    <span className="font-medium">Alight Motion / CapCut</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Focus</span>
                    <span className="font-medium">Retention</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIChat />
    </div>
  );
};

export default App;