"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import ShowHeader from '../../../../components/ShowHeader';

const Discussions = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        // جلب تفاصيل العرض
        const showData = await fetchFromTMDB(`/tv/${id}`);
        if (showData) {
          setShow(showData);
        }

        // جلب النقاشات
        const discussionsData = await fetchFromTMDB(`/tv/${id}/discussions`);
        if (discussionsData) {
          setDiscussions(discussionsData);
        }
      } catch (error) {
        console.error("Failed to fetch TV show details or discussions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!show) {
    return <div className="flex items-center justify-center min-h-screen">No TV show details found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      {show && <ShowHeader show={show} />}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Discussions for <span className="text-blue-500">{show.name}</span>
          </h1>
          <p className="text-lg mb-4">Here you can participate in discussions about the TV show.</p>
          <Link href={`/tv/${id}`} className="text-gray-700 dark:text-gray-300 underline hover:text-blue-500">
            Back to TV Show Details
          </Link>
        </section>

        <section className="mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b">Subject</th>
                  <th className="py-3 px-4 border-b">Status</th>
                  <th className="py-3 px-4 border-b">Replies</th>
                  <th className="py-3 px-4 border-b">Last Reply</th>
                </tr>
              </thead>
              <tbody>
                {discussions.length > 0 ? (
                  discussions.map((discussion) => (
                    <tr key={discussion.id}>
                      <td className="py-3 px-4 border-b">{discussion.subject}</td>
                      <td className="py-3 px-4 border-b">{discussion.status}</td>
                      <td className="py-3 px-4 border-b">{discussion.replies}</td>
                      <td className="py-3 px-4 border-b">{discussion.lastReply}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 px-4 border-b" colSpan="4">No discussions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};


export default Discussions;
