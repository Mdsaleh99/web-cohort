import { CDN_URL } from '../utils/constants';
import { FiClock } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';
import { useContext } from 'react';
import UserContext from '../utils/UserContext';

const RestaurantCard = (props) => {
  const { resData } = props;

  const { loggedInUser } = useContext(UserContext);

  const { cloudinaryImageId, name, cuisines, avgRating, costForTwo, sla } =
    resData;

  return (
    <div
      data-testid="resCard"
      className="m-4 p-4 w-[250px] bg-gray-100 rounded-lg hover:shadow-md hover:bg-gray-200 transition-all "
    >
      <div>
        <img
          className="w-[250px] h-[150px] rounded-lg"
          src={CDN_URL + cloudinaryImageId}
          alt="Biryani"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="py-4 text-lg font-bold">{name}</h3>
        <hr />
        <em>{cuisines.join(', ')}</em>
        <h4 className="flex items-center gap-2">
          <span className="icons">
            <AiOutlineStar />
          </span>
          <span>{avgRating} stars</span>
        </h4>
        <h4 className="flex items-center gap-2">
          {/* <span style={{ marginLeft: '4px' }}>₹</span> */}
          <span>{costForTwo}</span>
        </h4>
        <h4 className="flex items-center gap-2">
          <span>
            <FiClock />
          </span>
          <span>{sla.deliveryTime} minutes</span>
        </h4>
        <h4>User: {loggedInUser}</h4>
      </div>
    </div>
  );
};

// * Higher Order Component

// * input - RestaurantCard => RestaurantCardPromoted

export const withPromotedLabel = (RestaurantCard) => {
  return (props) => {
    return (
      <div>
        <label className="absolute p-2 mb-6 ml-4 text-white bg-black rounded-lg">
          Promoted
        </label>
        <RestaurantCard {...props} />
      </div>
    );
  };
};

export default RestaurantCard;
