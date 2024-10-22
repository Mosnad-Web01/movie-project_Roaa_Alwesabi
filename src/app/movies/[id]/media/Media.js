"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import FilterButtons from '../../../../components/FilterButtons';
import { useTranslation } from 'react-i18next'; // i18next for translation
import ReactModal from 'react-modal'; // تأكد من استيراد ReactModal

const Media = ({ movieId }) => {
  const [mostPopularVideos, setMostPopularVideos] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [posters, setPosters] = useState([]);
  const [selectedSection, setSelectedSection] = useState('popular'); // default section is 'popular'
  const { i18n } = useTranslation(); // Get current language from i18n

  // State to control modal visibility and selected video
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        console.log("Fetching media for movieId:", movieId);

        // Fetch video data
        const videoData = await fetchFromTMDB(`/movie/${movieId}/videos`, i18n.language);
        setMostPopularVideos(videoData?.results || []);

        // Fetch images data
        const imageData = await fetchFromTMDB(`/movie/${movieId}/images`, i18n.language);
        setBackdrops(imageData?.backdrops || []);
        setPosters(imageData?.posters || []);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    };

    if (movieId) {
      fetchMedia();
    }
  }, [movieId, i18n.language]);

  if (!movieId) {
    return <div className="text-center p-4">No movie ID provided.</div>;
  }

  const filterOptions = ['popular', 'videos', 'backdrops', 'posters'];

  // Function to open modal with selected video
  const openModal = (key) => {
    setTrailerKey(key);
    setModalIsOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setTrailerKey(''); // Reset trailer key when closing
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Media</h2>

        {/* Filter Buttons Component */}
        <FilterButtons
          filterOptions={filterOptions}
          currentFilter={selectedSection}
          setFilter={setSelectedSection}
          i18n={i18n}
        />

        {/* Media Content */}
        <div>
          {selectedSection === 'popular' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Most Popular</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {mostPopularVideos.length === 0 && (
                  <p>No popular videos available.</p>
                )}
                {mostPopularVideos.slice(0, 5).map((video) => (
                  <div key={video.id} className="relative">
                    <iframe
                      width="300"
                      height="200"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg shadow-lg cursor-pointer"
                      onClick={() => openModal(video.key)} // Open modal on click
                    ></iframe>
                  </div>
                ))}
                {backdrops.length === 0 && (
                  <p>No backdrops available.</p>
                )}
                {backdrops.slice(0, 5).map((backdrop) => (
                  <img
                    key={backdrop.file_path}
                    src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                    alt="Backdrop"
                    className="rounded-lg shadow-lg min-w-[200px] h-[120px] object-cover"
                  />
                ))}
                {posters.length === 0 && (
                  <p>No posters available.</p>
                )}
                {posters.slice(0, 5).map((poster) => (
                  <img
                    key={poster.file_path}
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Poster"
                    className="rounded-lg shadow-lg min-w-[200px] h-[300px] object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'videos' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Videos</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {mostPopularVideos.length === 0 && (
                  <p>No videos available.</p>
                )}
                {mostPopularVideos.map((video) => (
                  <div key={video.id} className="relative">
                    <iframe
                      width="300"
                      height="200"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg shadow-lg cursor-pointer"
                      onClick={() => openModal(video.key)} // Open modal on click
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'backdrops' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Backdrops</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {backdrops.length === 0 && (
                  <p>No backdrops available.</p>
                )}
                {backdrops.map((backdrop) => (
                  <img
                    key={backdrop.file_path}
                    src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                    alt="Backdrop"
                    className="rounded-lg shadow-lg min-w-[200px] h-[120px] object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'posters' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Posters</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {posters.length === 0 && (
                  <p>No posters available.</p>
                )}
                {posters.map((poster) => (
                  <img
                    key={poster.file_path}
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Poster"
                    className="rounded-lg shadow-lg min-w-[200px] h-[300px] object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for Trailer */}
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Trailer"
          className="bg-gray-800 p-4 rounded-md w-full max-w-2xl mx-auto my-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        >
          {trailerKey && (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4 text-white">{movie.title}</h2>
              <iframe
                width="100%"
                height="300"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm">
                Close
              </button>
            </div>
          )}
        </ReactModal>
      </div>
    </div>
  );
};

export default Media;
