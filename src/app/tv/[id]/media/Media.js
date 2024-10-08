"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import FilterButtons from '../../../../components/FilterButtons';
import { useTranslation } from 'react-i18next'; // i18next for translation

const Media = ({ showId }) => {
  const [mostPopularVideos, setMostPopularVideos] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [posters, setPosters] = useState([]);
  const [selectedSection, setSelectedSection] = useState('popular'); // default section is 'popular'
  const { i18n } = useTranslation(); // Get current language from i18n

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        console.log("Fetching media for showId:", showId);

        // Fetch video data
        const videoData = await fetchFromTMDB(`/tv/${showId}/videos`, i18n.language);
        setMostPopularVideos(videoData?.results || []);

        // Fetch images data
        const imageData = await fetchFromTMDB(`/tv/${showId}/images`, i18n.language);
        setBackdrops(imageData?.backdrops || []);
        setPosters(imageData?.posters || []);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    };

    if (showId) {
      fetchMedia();
    }
  }, [showId, i18n.language]);

  if (!showId) {
    return <div className="text-center p-4">No TV show ID provided.</div>;
  }

  const filterOptions = ['popular', 'videos', 'backdrops', 'posters'];

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
                  <iframe
                    key={video.id}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                  ></iframe>
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
                  <iframe
                    key={video.id}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                  ></iframe>
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
      </div>
    </div>
  );
};

export default Media;
