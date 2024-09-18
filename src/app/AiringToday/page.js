"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import FilterByGenreAndSort from '../../components/FilterByGenreAndSort';
import MovieCard from '../../components/MovieCard'; // استخدام مكون البطاقة
import useAuth from '../../lib/useAuth'; // التحقق من تسجيل الدخول

const AiringToday = () => {
  const [tvShows, setTVShows] = useState([]);
  const [filteredTVShows, setFilteredTVShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showsPerPage] = useState(6); // عدد المسلسلات في كل صفحة

  const user = useAuth(); // الحصول على حالة المستخدم

  useEffect(() => {
    const fetchTVShows = async () => {
      const data = await fetchFromTMDB('/tv/airing_today');
      if (data) {
        setTVShows(data.results);
        setFilteredTVShows(data.results);
      }
    };

    fetchTVShows();
  }, []);

  const handleFilterChange = (selectedGenres, sortOrder) => {
    let filtered = tvShows;

    // التصفية حسب الأنواع المختارة
    if (selectedGenres.length > 0) {
      filtered = tvShows.filter(show =>
        selectedGenres.every(genre => show.genre_ids.includes(genre))
      );
    }

    // الفرز حسب الترتيب المختار
    filtered.sort((a, b) => {
      if (sortOrder === 'popularity.desc') {
        return b.popularity - a.popularity;
      } else if (sortOrder === 'first_air_date.desc') {
        return new Date(b.first_air_date) - new Date(a.first_air_date);
      } else if (sortOrder === 'vote_average.desc') {
        return b.vote_average - a.vote_average;
      } else if (sortOrder === 'vote_count.desc') {
        return b.vote_count - a.vote_count;
      }
      return 0;
    });

    setFilteredTVShows(filtered);
    setCurrentPage(1); // العودة إلى الصفحة الأولى بعد التصفية
  };

  // حساب الفهرس للعرض الحالي
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredTVShows.slice(indexOfFirstShow, indexOfLastShow);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTVShows.length / showsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900">
      {/* Sidebar - Filters */}
      <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-6 sm:space-y-8 shadow-md rounded-lg">
        <FilterByGenreAndSort onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Content - TV Shows */}
      <main className="w-full lg:w-3/4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {currentShows.map(show => (
            <MovieCard 
              key={show.id} 
              item={show} 
              isLoggedIn={!!user}
              media_type="tv" // تعيين media_type كـ "tv"
            />
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
          >
            Previous
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredTVShows.length / showsPerPage)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default AiringToday;
