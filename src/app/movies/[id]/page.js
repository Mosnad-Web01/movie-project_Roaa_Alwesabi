"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Image from 'next/image';
import Cast from './cast/page';
import Link from 'next/link';
import SocialOptions from './SocialOptions';
import Media from './media/Media';
import Recommendations from './recommendations/Recommendations';
import { FaList, FaHeart, FaEye, FaStar, FaPlay } from 'react-icons/fa';
import ReactModal from 'react-modal';
import useAuth from '../../../lib/useAuth';
import { useTranslation } from 'react-i18next';
import MovieActions from '../../../components/MovieActions'; 
import TrailerModal from '../../../components/TrailerModal'; 
// استيراد مكتبة i18next للترجمة

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [overviewTooLong, setOverviewTooLong] = useState(false);
  const { i18n } = useTranslation(); // جلب اللغة الحالية من i18next

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        try {
          // إضافة اللغة إلى الفيتش
          const data = await fetchFromTMDB(`/movie/${id}`, i18n.language);
          if (data) {
            setMovie(data);

            // Fetch credits to get the director
            const credits = await fetchFromTMDB(`/movie/${id}/credits`, i18n.language);
            const director = credits.crew.find(member => member.job === 'Director');
            data.director = director ? director : null; // Add director info to movie object

            // Check if the overview is too long
            const overviewLengthThreshold = 300; // Adjust the threshold as needed
            if (data.overview.length > overviewLengthThreshold) {
              setOverviewTooLong(true);
            }

                // Fetch trailers
                const videos = await fetchFromTMDB(`/movie/${id}/videos`, i18n.language);
                const trailer = videos.results.find(video => video.type === 'Trailer');
                if (trailer) {
                  setTrailerKey(trailer.key);
                }
              }
              setIsLoading(false);
            } catch (error) {
              console.error("Failed to fetch movie details:", error);
              setIsLoading(false);
            }
          };
      fetchMovieDetails();
    } else {
      console.error("No movie ID found.");
      setIsLoading(false);
    }
  }, [id, i18n.language]); // إضافة i18n.language كمراقب

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>No movie details found.</div>;
  }

  const toggleOverview = () => setIsOverviewExpanded(!isOverviewExpanded);

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Movie details */}
        <section
  className="relative"
  style={{
    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
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
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={300}
        height={450}
        className="rounded-lg shadow-lg"
        layout="responsive"
      />
    </div>
    <div className="w-full lg:w-3/4 lg:ml-8 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {movie.title} ({new Date(movie.release_date).getFullYear()})
      </h1>
      {movie.genres && movie.genres.length > 0 && (
        <p className="text-md md:text-lg mb-4">
          {i18n.t('Genres')}: {movie.genres.map(genre => genre.name).join(', ')}
        </p>
      )}
      <p className="text-md md:text-lg mb-4">
        {i18n.t('Release Date')}: {new Date(movie.release_date).toLocaleDateString()}
      </p>
      <p className="text-md md:text-lg mb-4">
        {i18n.t('Runtime')}: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
      </p>
      <p className="text-md md:text-lg mb-4">
        {i18n.t('Language')}: {movie.original_language.toUpperCase()}
      </p>
      <p className="text-md md:text-lg mb-4">
        {i18n.t('Rating')}: {movie.vote_average} ({movie.vote_count} votes)
      </p>
      <p className="text-md md:text-lg mb-4">
        {i18n.t('Director')}: {movie.director ? movie.director.name : 'N/A'}
      </p>
      <p className={`text-md md:text-lg mb-4 ${!isOverviewExpanded && overviewTooLong ? 'line-clamp-3' : ''}`}>
        {movie.overview}
      </p>
      {overviewTooLong && (
        <button onClick={toggleOverview} className="text-blue-500 hover:underline mt-4">
          {isOverviewExpanded ? i18n.t('Read Less') : i18n.t('Read More')}
        </button>
      )}

      {/* شركات الإنتاج */}
      {movie.production_companies && movie.production_companies.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {i18n.t('Production Companies')}
          </h2>
          <div className="flex flex-wrap gap-6">
            {movie.production_companies.map(company => (
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
                <FaPlay className="mr-2" /> {i18n.t('Play Trailer')}
              </button>
            </div>
          </div>
        </section>


        {/* Cast section */}
        <section>
          <Cast movieId={id} />
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Full Cast & Crew */}
        <section className="mt-8">
          <Link href={`/movies/${id}/full-cast`} className="text-black dark:text-white text-lg font-semibold border-b-2 border-black dark:border-white inline-block pb-1">
            {i18n.t('Full Cast & Crew')}
          </Link>
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Social Options */}
        <section className="text-lg mt-8">
          <SocialOptions movieId={id} />
        </section>
        
          {/* Media Section */}
          <section className="mt-8">
          <Media movieId={id} />
        </section>

        {/* Recommendations */}
        <section className="mt-8">
          <Recommendations movieId={id} />
        </section>
        
        
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

export default MovieDetails;
