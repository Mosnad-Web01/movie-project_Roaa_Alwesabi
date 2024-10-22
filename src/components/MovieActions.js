import React, { useState, useEffect } from 'react';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useAuth from '../lib/useAuth';

const ItemActions = ({ itemId, itemName, itemPoster, itemType }) => {
  const { i18n } = useTranslation();
  const user = useAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showListOptions, setShowListOptions] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  // Fetch stored data from localStorage
  useEffect(() => {
    const listData = JSON.parse(localStorage.getItem('list')) || [];
    const favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
    const watchlistData = JSON.parse(localStorage.getItem('watchlist')) || [];
    const ratingData = JSON.parse(localStorage.getItem('ratings')) || {};
    const storedLists = JSON.parse(localStorage.getItem('lists')) || [];

    setIsAdded(listData.some(item => item.id === itemId));
    setIsFavorite(favoriteData.some(item => item.id === itemId));
    setIsWatchlist(watchlistData.some(item => item.id === itemId));
    setUserRating(ratingData[itemId] || 0);
    setLists(storedLists);
  }, [itemId]);

  const handleAddToList = () => {
    if (!user) return alert('You need to be logged in!');

    let listData = JSON.parse(localStorage.getItem(selectedList) || '[]');

    if (isAdded) {
      const updatedList = listData.filter(item => item.id !== itemId);
      localStorage.setItem(selectedList, JSON.stringify(updatedList));
      setIsAdded(false);
    } else {
      const newItem = {
        id: itemId,
        name: itemName,
        type: itemType,
        poster: itemPoster,
        media_type: itemType
      };
      listData.push(newItem);
      localStorage.setItem(selectedList, JSON.stringify(listData));
      setIsAdded(true);
    }
  };

  const handleAddToFavorites = () => {
    if (!user) return alert('You need to be logged in!');

    let favoriteData = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updatedFavorites = favoriteData.filter(item => item.id !== itemId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favoriteData.push({
        id: itemId,
        name: itemName,
        type: itemType,
        poster: itemPoster,
        media_type: itemType
      });
      localStorage.setItem('favorites', JSON.stringify(favoriteData));
      setIsFavorite(true);
    }
  };

  const handleAddToWatchlist = () => {
    if (!user) return alert('You need to be logged in!');

    let watchlistData = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isWatchlist) {
      const updatedWatchlist = watchlistData.filter(item => item.id !== itemId);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsWatchlist(false);
    } else {
      watchlistData.push({
        id: itemId,
        name: itemName,
        type: itemType,
        poster: itemPoster,
        media_type: itemType
      });
      localStorage.setItem('watchlist', JSON.stringify(watchlistData));
      setIsWatchlist(true);
    }
  };

  const handleRating = (rating) => {
    if (!user) return alert('You need to be logged in!');

    const ratingData = JSON.parse(localStorage.getItem('ratings') || '{}');
    if (userRating === rating) {
      delete ratingData[itemId];
      setUserRating(0);
    } else {
      ratingData[itemId] = rating;
      setUserRating(rating);
    }
    localStorage.setItem('ratings', JSON.stringify(ratingData));
  };

  return (
    <div className="mt-8">
      <ul className="flex flex-wrap sm:flex-nowrap space-x-4">
        <li
          className="relative px-4 py-2 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={() => setShowListOptions(!showListOptions)}
        >
          <FaList className={`mr-2 ${isAdded ? 'text-gray-500' : ''}`} />
          {i18n.t(isAdded ? 'Already in List' : 'Add to list')}
          {showListOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
              <select 
                value={selectedList} 
                onChange={(e) => setSelectedList(e.target.value)} 
                className="w-full p-2 border rounded-md mb-2"
              >
                <option value="">Select a list</option>
                {lists.map((list, index) => (
                  <option key={index} value={list}>{list}</option>
                ))}
              </select>
              <button 
                onClick={handleAddToList} 
                className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!selectedList}
              >
                <FaList className={`mr-2 ${isAdded ? 'text-gray-500' : ''}`} />
                {i18n.t(isAdded ? 'Remove from List' : 'Add to List')}
              </button>
            </div>
          )}
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={handleAddToFavorites}
        >
          <FaHeart className={`mr-2 ${isFavorite ? 'text-gray-500' : ''}`} />
          {i18n.t(isFavorite ? 'Already in Favorites' : 'Add to Favorites')}
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={handleAddToWatchlist}
        >
          <FaEye className={`mr-2 ${isWatchlist ? 'text-gray-500' : ''}`} />
          {i18n.t(isWatchlist ? 'Already in Watchlist' : 'Add to Watchlist')}
        </li>
        <li className="flex items-center">
          <span className="mr-2">{i18n.t('Your Rating')}:</span>
          {[1, 2, 3, 4, 5].map(star => (
            <FaStar
              key={star}
              className={`mr-1 cursor-pointer ${star <= userRating ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => handleRating(star)}
            />
          ))}
        </li>
      </ul>
    </div>
  );
};

export default ItemActions;
