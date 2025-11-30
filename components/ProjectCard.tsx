import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { Play } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className }) => {
  return (
    <motion.div
      layoutId={`project-${project.id}`}
      onClick={() => onClick(project)}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 ${className || 'aspect-[4/5]'}`}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
        >
          <span className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/10">
            {project.category}
          </span>
          <h3 className="text-2xl font-bold tracking-tight mb-1">{project.title}</h3>
          <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {project.description}
          </p>
        </motion.div>
        
        {/* Play Icon - Centered on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Play fill="white" className="w-6 h-6 ml-1 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;