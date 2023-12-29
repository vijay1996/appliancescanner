import { useState } from "react";
import { createFields } from "../util/helpers";

const FilterPanel = ({filterCriteria,setFilterCriteria}) => {
    const [filterState, setFilterState] = useState({
        category: filterCriteria.category,
        minPrice: filterCriteria.minPrice,
        maxPrice: filterCriteria.maxPrice,
        sort: filterCriteria.sort,
        descending: false
    });
    return (
        <div className="col-md-2">
            <div className="form">
                {createFields(
                    "category", 
                    "Category", 
                    "select", 
                    (value) => setFilterState(prev => ({...prev, category: value})), 
                    filterState.category, 
                    ["television", "refrigerator", "air conditioner", "microwave oven", "washing machine"]
                )}
                <br/><br/>
                {createFields(
                    "minPrice", 
                    "Minimum price", 
                    "number", 
                    (value) => setFilterState(prev => ({...prev, minPrice: value})),
                    filterState.minPrice
                )}
                {createFields(
                    "maxPrice", 
                    "Maximum price", 
                    "number", 
                    (value) => setFilterState(prev => ({...prev, maxPrice: value})),
                    filterState.maxPrice
                )}
                <br /><br/>
                {createFields(
                    "sort", 
                    "Sort by", 
                    "select", 
                    (value) => setFilterState(prev => ({...prev, sort: value})),
                    filterState.sort, 
                    ["name", "price", "cost per capacity", "capacity", "reviews", "rating", "brand", "model"]
                )}
                {createFields(
                    "descending",
                    "Arrange in descending order",
                    "checkbox",
                    () => setFilterState(prev => ({...prev, descending: !prev.descending}))
                )}
                <br /><br/>
                {createFields(null, "Search", "button", () => {setFilterCriteria({...filterState})})}
            </div>
        </div>
    )
}

export default FilterPanel;