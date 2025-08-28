import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useRestaurantMenu from '../utils/useRestaurantMenu';
import RestaurantCategory from './RestaurantCategory';
import Loader from './Loader';

const RestaurantMenu = () => {
  const { resId } = useParams();

  const dummy = 'Dummy Data';

  const resInfo = useRestaurantMenu(resId);

  const [showIndex, setShowIndex] = useState(null);

  if (resInfo === null) return <Loader />;

  const {
    name,
    cuisines,
    costForTwoMessage,
    cloudinaryImageId,
    avgRating,
    deliveryTime,
  } = resInfo?.cards[0]?.card?.card?.info;

  const { itemCards } =
    resInfo?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards[1]?.card?.card;

  const categories =
    resInfo?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
      (c) =>
        c.card?.card?.['@type'] ===
        'type.googleapis.com/swiggy.presentation.food.v2.ItemCategory'
    );

  // console.log(categories);

  return (
    <div className="text-center">
      <h1 className="my-6 text-2xl font-bold">{name}</h1>
      <p className="text-lg font-bold">
        {cuisines.join(', ')} - {costForTwoMessage}
      </p>

      <div className="text-left">
        <Link
          to="/"
          className="px-4 py-2 ml-40 font-bold duration-[0.3s] bg-green-400 rounded-md hover:bg-green-500"
        >
          &larr; Back
        </Link>
      </div>

      {/* categories accordions */}
      {categories.map((category, index) => (
        // Controlled Component
        <RestaurantCategory
          key={category?.card?.card.title}
          data={category?.card?.card}
          showItems={index === showIndex ? true : false}
          setShowIndex={() => setShowIndex(index)}
          dummy={dummy}
        />
      ))}
    </div>
  );
};

export default RestaurantMenu;
