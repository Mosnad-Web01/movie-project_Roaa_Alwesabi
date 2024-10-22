"use client"; // Define this component as a client component in Next.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Image from 'next/image';
import Cast from './cast/page'; // Ensure this component exists
import Link from 'next/link';
import SocialOptions from './SocialOptions'; // Ensure this component exists
import Media from './media/Media'; // Ensure this component exists
import Recommendations from './recommendations/Recommendations'; // Ensure this component exists
import { FaList, FaHeart, FaEye, FaStar, FaPlay } from 'react-icons/fa';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next'; // Import i18next for translation

const TVShowDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation(); // Get translation function and current language
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchShowDetails = async () => {
        try {
          const data = await fetchFromTMDB(`/tv/${id}`, i18n.language); // Pass language to fetch function
          if (data) {
            setShow(data);
            // Fetch trailers
            const videos = await fetchFromTMDB(`/tv/${id}/videos`, i18n.language); // Pass language to fetch function
            const trailer = videos.results.find(video => video.type === 'Trailer');
            if (trailer) {
              setTrailerKey(trailer.key);
            }
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch TV show details:", error);
          setIsLoading(false);
        }
      };
      fetchShowDetails();
    } else {
      console.error("No TV show ID found.");
      setIsLoading(false);
    }
  }, [id, i18n.language]); // Add language as a dependency

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const toggleOverview = () => setIsOverviewExpanded(!isOverviewExpanded);

  if (isLoading) {
    return <div>{t('Loading')}...</div>; // Translated loading text
  }

  if (!show) {
    return <div>{t('No TV show details found')}.</div>; // Translated not found text
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* TV Show details */}
        <section
          className="relative"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '99.4vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginTop: 'calc(-50.5vw + 50%)',
            opacity: 0.8,
          }}
        >
          {/* الطبقة الشفافة */}
          <div
            className="absolute inset-0 bg-white"
            style={{ opacity: '0.5', zIndex: 1 }}
          ></div>

          {/* المحتوى فوق الخلفية */}
          <div className="relative z-10 flex flex-col lg:flex-row bg-opacity-75 bg-black p-8 rounded-lg shadow-lg">
            <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
                layout="responsive"
              />
            </div>
            <div className="w-full lg:w-3/4 lg:ml-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {show.name} ({new Date(show.first_air_date).getFullYear()})
              </h1>
              {/* Display genres */}
              {show.genres && show.genres.length > 0 && (
                <p className="text-md md:text-lg mb-4">
                  {t('Genres')}: {show.genres.map(genre => genre.name).join(', ')}
                </p>
              )}
              <p className="text-md md:text-lg mb-4">{t('Release Date')}: {new Date(show.first_air_date).toLocaleDateString()}</p>
              <p className="text-md md:text-lg mb-4">
                {t('Runtime')}: {show.episode_run_time && show.episode_run_time.length > 0 
                  ? `${Math.floor(show.episode_run_time[0] / 60)}h ${show.episode_run_time[0] % 60}m` 
                  : 'N/A'}
              </p>
              <p className="text-md md:text-lg mb-4">{t('Language')}: {show.original_language.toUpperCase()}</p>
              <p className="text-md md:text-lg mb-4">{t('Rating')}: {show.vote_average} ({show.vote_count} {t('votes')})</p>
              <p className="text-md md:text-lg mb-4">{t('Creator')}: {show.created_by && show.created_by.length > 0 ? show.created_by.map(creator => creator.name).join(', ') : 'N/A'}</p>
              <p className={`text-md md:text-lg mb-4 ${!isOverviewExpanded ? 'line-clamp-3' : ''}`}>
                {show.overview}
              </p>
              <button
                onClick={toggleOverview}
                className="text-blue-500 hover:underline mt-4"
              >
                {isOverviewExpanded ? t('Read Less') : t('Read More')}
              </button>

              {/* Production Companies */}
              {show.production_companies && show.production_companies.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">{t('Production Companies')}</h2>
                  <div className="flex flex-wrap gap-6">
                    {show.production_companies.map(company => (
                      <div key={company.id} className="flex items-center mb-4">
                        {company.logo_path && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            width={100}
                            height={50}
                            className="mr-4"
                          />
                        )}
                        <p className="text-md md:text-lg">{company.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              
              <button
                onClick={openModal}
                className="bg-gray-700 dark:hover:bg-gray-500 text-white rounded-full py-2 px-6 mt-8 flex items-center justify-center hover:bg-gray-900 border border-gray-700"
              >
                <FaPlay className="mr-2" /> {t('Play Trailer')}
              </button>
            </div>
          </div>
        </section>

        {/* Cast section */}
        <section>
          <Cast showId={id} />
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        <section className="mt-8">
          <Link href={`/tv/${id}/full-cast`} className="text-lg font-semibold text-blue-500 hover:underline">
            {t('Full Cast & Crew')}
          </Link>
        </section>

        {/* Social options */}
        <section className="mt-8">
          <SocialOptions showId={id} />
        </section>

        {/* Media */}
        <section className="mt-8">
          <Media showId={id} />
        </section>

        {/* Recommendations */}
        <section className="mt-8">
          <Recommendations showId={id} />
        </section>
      </div>

      {/* Trailer Modal */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Trailer"
        className="bg-gray-800 p-4 rounded-md w-full max-w-2xl mx-auto my-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {trailerKey && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-white">{show.name}</h2>
            <iframe
              width="100%"
              height="300"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={show.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm">
              {t('Close')}
            </button>
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default TVShowDetails;
