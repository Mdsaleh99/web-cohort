import { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import resList from '../utils/mockData';

const Body = () => {
    // * React Hook -> A normal JavaScript function which is given to us by React (or) Normal JS utility functions
    // * useState() - Super Powerful variable
    // * useEffect() -

    // normal js variable - cannot update the variable value and cannot re-render the component
    // state variable - can update the variable value and can re-render the component

    // useState - Whenever a state variable updates, React re-renders the whole component, and then updates only the parts of the DOM (using the react reconciliation algorithm) that actually changed. The state variable will have the new updated value in that re-render
    // e.g: listOfRestaurants has inital value before updting state variable, when state variable update with different value it re-renders whole component and state variable has new (updated) value
    // react most popular or why large application super fast - because react make DOM manipulation or operation super fast, it keep sync the data layer with ui layer
    // react uses reconciliation algorithm which also known as react fiber
    // in react 16 new algorithm came out to update the dom which is react fiber
    // diff algorithm

    // * if no dependency array => useEffect is called on every component render of the component
    // * if the dependency array is empty => useEffect is called only on the initial render(just once) of the component
    // * if the dependency array contains a dependency => useEffect is called everytime the value of the depencecy changes
    // * Dependency: A depency can be a state variable (or) a function

    // * State variable - Super Powerful variable
    const [listOfRestaurants, setListOfRestaurants] = useState(resList);
    // const arr = useState();
    // const stateVariable = arr[0]; // current value of the state variable
    // const setStateVariable = arr[1]; // function to update the state variable

    // * Normal JS variable
    // const listOfRestaurants = [
    //   {
    //     type: 'restaurant',
    //     data: {
    //       id: '334475',
    //       name: 'KFC',
    //       cloudinaryImageId: 'bdcd233971b7c81bf77e1fa4471280eb',
    //       cuisines: ['Burgers', 'Biryani', 'American', 'Snacks', 'Fast Food'],
    //       costForTwo: 40000,
    //       deliveryTime: 36,
    //       avgRating: '3.8',
    //     },
    //   },
    //   {
    //     type: 'restaurant',
    //     data: {
    //       id: '334476',
    //       name: 'Dominos',
    //       cloudinaryImageId: 'bdcd233971b7c81bf77e1fa4471280eb',
    //       cuisines: ['Burgers', 'Biryani', 'American', 'Snacks', 'Fast Food'],
    //       costForTwo: 40000,
    //       deliveryTime: 36,
    //       avgRating: '4.8',
    //     },
    //   },
    //   {
    //     type: 'restaurant',
    //     data: {
    //       id: '334477',
    //       name: 'McDonals',
    //       cloudinaryImageId: 'bdcd233971b7c81bf77e1fa4471280eb',
    //       cuisines: ['Burgers', 'Biryani', 'American', 'Snacks', 'Fast Food'],
    //       costForTwo: 40000,
    //       deliveryTime: 36,
    //       avgRating: '4.2',
    //     },
    //   },
    // ];

    return (
        <div className="body">
            {/* <div className="search-container">
        <input type="text" placeholder="Search Food or Restaurant" />
        <button>Search</button>
      </div> */}
            <div className="filter">
                <button
                    className="filter-btn"
                    onClick={() => {
                        // * Filter logic
                        const filteredList = listOfRestaurants.filter(
                            (res) => res.data.avgRating > 4,
                        );

                        setListOfRestaurants(filteredList);
                        console.log(filteredList);
                    }}
                >
                    Top Rated Restaurants
                </button>
            </div>
            <div className="res-container">
                {/* // * looping through the <RestaurentCard /> components Using Array.map() method */}

                {listOfRestaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.data.id}
                        resData={restaurant}
                    />
                ))}
            </div>
        </div>
    );
};

export default Body;
