"use client";

import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import ScrollableActorList from '../../../../components/ScrollableActorList'; // تأكد من المسار الصحيح

const Cast = ({ movieId }) => {
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      const fetchCast = async () => {
        try {
          const castData = await fetchFromTMDB(`/movie/${movieId}/credits`);
          if (castData && castData.cast) {
            setCast(castData.cast);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch cast:", error);
          setIsLoading(false);
        }
      };
      fetchCast();
    }
  }, [movieId]);

  if (isLoading) {
    return <div>Loading cast...</div>;
  }

  if (cast.length === 0) {
    return <div>No cast information available.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Cast</h2>
      <ScrollableActorList 
        actors={cast} // تمرير قائمة الممثلين هنا
        isLoggedIn={false} // يمكنك ضبط حالة تسجيل الدخول كما تحتاج
        toggleDropdown={() => {}} // أضف وظيفة لإدارة قائمة المنسدلة إذا لزم الأمر
        dropdownVisible={null} // ضبط حالة القائمة المنسدلة
      />
    </div>
  );
};

export default Cast;
