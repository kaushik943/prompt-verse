import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Heart, 
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react';
import showcaseData from './data.json';
import './index.css';

const BananaPrompt = () => {
  const [data] = useState(showcaseData[0]); // Focusing on the requested detail view

  return (
    <div className="detail-page">
      <div className="detail-overlay">
        {/* Left Column: The Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="image-container"
        >
          <img src={data.image_url} alt={data.title} />
        </motion.div>

        {/* Right Column: Information */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="info-container"
        >
          <div className="badge-prompt">Prompt Detail</div>
          
          <h1 className="detail-title">{data.title}</h1>
          
          <div className="detail-meta">
            <span>Shared by <a href="#" className="author-link">{data.author}</a></span>
            <span>Posted on {data.date}</span>
          </div>

          <div className="prompt-section">
            <div className="prompt-label">Prompt</div>
            <p className="prompt-text">
              {data.prompt}
            </p>
            
            <div className="prompt-actions">
              <button className="btn-copy">
                <Copy size={18} /> Copy
              </button>
              <button className="btn-try">
                Try this
              </button>
            </div>
          </div>

          <div className="footer-actions">
            <div className="like-count">
              <button className="btn-icon">
                <Heart size={20} />
              </button>
              {data.likes}
            </div>
            
            <button className="btn-icon">
              <Bookmark size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BananaPrompt;
