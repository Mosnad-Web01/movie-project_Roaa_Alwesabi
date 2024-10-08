// src/components/LatestTrailers.js
"use client";
import React, { useState, useEffect } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import useAuth from '../lib/useAuth';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import TrailerModal from './TrailerModal'; // استيراد المكون

const LatestTrailers = () => {
  const [trailers, setTrailers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [filter, setFilter] = useState('popular');
  const user = useAuth();
  const isLoggedIn = !!user;
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }
  }, []);

  useEffect(() => {
    const fetchLatestTrailers = async () => {
      try {
        let endpoint = '';
        switch (filter) {
          case 'popular':
            endpoint = '/movie/popular';
            break;
          case 'streaming':
            endpoint = '/movie/now_playing';
            break;
          case 'on_tv':
            endpoint = '/tv/on_the_air';
            break;
          case 'for_rent':
            endpoint = '/movie/upcoming';
            break;
          case 'in_theaters':
            endpoint = '/movie/now_playing';
            break;
          default:
            endpoint = '/movie/popular';
        }

        const moviesData = await fetchFromTMDB(endpoint, i18n.language);
        const movieResults = moviesData.results || [];

        const trailerPromises = movieResults.map(async (movie) => {
          const videoData = await fetchFromTMDB(`/movie/${movie.id}/videos`, i18n.language);
          return videoData.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
        });

        const fetchedTrailers = await Promise.all(trailerPromises);
        setTrailers(fetchedTrailers.filter(Boolean));
      } catch (error) {
        console.error("Error fetching trailers:", error);
      }
    };

    fetchLatestTrailers();
  }, [filter, i18n.language]);

  const openModal = (trailer) => {
    setSelectedTrailer(trailer);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedTrailer(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-4">
      <h2 className="text-2xl font-bold mb-4">{i18n.t('Latest Trailers')}</h2>

      {/* الأزرار للفلترة */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* هنا أزرار الفلترة كما هي */}
      </div>

      {/* عرض التريلرز */}
      <div className="relative overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {trailers.length > 0 ? (
            trailers.map((trailer) => (
              <div key={trailer.id} className="relative rounded-md shadow-md overflow-hidden w-80 flex-shrink-0">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.title || trailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="p-2">
                  <h3 className="text-lg font-bold">{trailer.title || trailer.name}</h3>
                  <p className="text-sm">{new Date(trailer.release_date).toDateString()}</p>
                </div>
                <button
                  onClick={() => openModal(trailer)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.576-2.608A1 1 0 009 9.383v5.233a1 1 0 001.576.815l4.576-2.608a1 1 0 000-1.632z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p>{i18n.t('No trailers available for the selected category.')}</p>
          )}
        </div>
      </div>

      {/* استدعاء المكون المنبثق */}
      <TrailerModal 
        isOpen={isOpen} 
        closeModal={closeModal} 
        selectedTrailer={selectedTrailer} 
      />
    </div>
  );
};

export default LatestTrailers;
