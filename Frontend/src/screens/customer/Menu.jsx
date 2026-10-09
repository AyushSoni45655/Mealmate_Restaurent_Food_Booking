import React, { useEffect, useMemo, useState } from "react";
import { categories } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import useMsgHandler from "../../../utils/msgHandler";
import { getAllProducts } from "../../redux(state managemant)/slices/product.slice";
import { NavLink } from "react-router-dom";

const categoryNames = categories.map((item) => item.name);
const foodTypes = ["Veg", "Non-veg", "Egg"];
const spicyOptions = ["True", "False"];

const getSubCategories = (categoryName) =>
  categories
    .find((item) => item.name === categoryName)
    ?.subcategories?.map((item) => item.name) ?? [];

const CustomDropDown = ({ title, name, data = [], onChange, value }) => (
  <div className="flex flex-col w-full h-fit gap-1">
    <h4 className="!text-white">{title}</h4>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="outline-none border-2 border-gray-400 rounded-md bg-white !text-black"
    >
      <option value="">{`Choose ${title}`}</option>
      {data.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
);

const Menu = () => {
  const dispatch = useDispatch();
  const { pError, pSuccess, allProduct, page, limit, pLoading } = useSelector(
    (state) => state.product,
  );

  useMsgHandler(pSuccess, pError);

  const [filterData, setFilterData] = useState({
    category: categoryNames[0],
    subCategory: getSubCategories(categoryNames[0])[0] ?? "",
    isSpicy: "",
    foodType: "",
  });

  const { category, subCategory, isSpicy, foodType } = filterData;

  const subCategoryNames = useMemo(
    () => getSubCategories(category),
    [category],
  );

  const handlerOnChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prev) => {
      if (name === "category") {
        // category बदलने पर subCategory नई category की पहली वाली हो जाए
        return {
          ...prev,
          category: value,
          subCategory: getSubCategories(value)[0] ?? "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    dispatch(
      getAllProducts({
        page,
        limit,
        category,
        subCategory,
      }),
    );
  }, [dispatch, category, subCategory, page, limit]);

  const filteredProducts = useMemo(() => {
    const foodTypeValue = foodType.toLowerCase(); // "Non-veg" → "non-veg"
    const isSpicyValue = isSpicy.toLowerCase() === "true"; // "True" → true, "False" → false

    return (allProduct ?? []).filter((item) => {
      const spicyMatch = isSpicy === "" || item.isSpicy === isSpicyValue;
      const foodTypeMatch =
        foodType === "" || item.foodType?.toLowerCase() === foodTypeValue;

      return spicyMatch && foodTypeMatch;
    });
  }, [allProduct, isSpicy, foodType]);

  console.log("hello", filteredProducts);

  return (
    <div className="w-full min-h-screen flex">
      <aside className="w-fit h-screen sticky top-0 bg-[#1a1a1a] px-2 !text-white flex flex-col gap-2">
        <h2 className="!text-white">Filter</h2>
        <CustomDropDown
          title="Category"
          name="category"
          data={categoryNames}
          onChange={handlerOnChange}
          value={category}
        />
        <CustomDropDown
          title="SubCategory"
          name="subCategory"
          data={subCategoryNames}
          onChange={handlerOnChange}
          value={subCategory}
        />
        <CustomDropDown
          title="Food Type"
          name="foodType"
          data={foodTypes}
          onChange={handlerOnChange}
          value={foodType}
        />
        <CustomDropDown
          title="Spiciness"
          name="isSpicy"
          data={spicyOptions}
          onChange={handlerOnChange}
          value={isSpicy}
        />
      </aside>
      <div className="flex-1 bg-gray-800 ">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl !text-white p-4">
          Products
        </h1>
        <div className="w-full h-fit flex items-center justify-center ">
          <div className="w-full h-fit flex items-center justify-center flex-wrap gap-10">
            {pLoading ? (
              <div className="loader flex flex-col items-center justify-center">
                {" "}
                <h4>Loading....</h4>
              </div>
            ) : (
              filteredProducts.map((item) => (
                <div
                  key={item._id}
                  className="relative flex items-center justify-center text-sm text-white/80 rounded-lg shadow-sm w-full mx-8 md:max-w-80"
                >
                  {item.isFeatured && (
                    <div className=" absolute top-2 right-1   w-fit h-fit p-1 text-md rounded-md">
                      <p className="text-xl font-bold !text-white">⭐</p>
                    </div>
                  )}
                  {/* Food Type  */}
                  <div className=" absolute top-2 left-1   w-fit h-fit px-2  text-md rounded-md">
                      <p className="text-lg font-bold !text-black-700">{`${item.foodType}`.toUpperCase()}</p>
                    </div>
                  <div className="absolute bottom-2 flex items-center justify-around backdrop-blur-sm w-full max-w-72 rounded-md bg-white/10 border border-white/20 py-2">
                    <div className="flex flex-col justify-start items-start">
                      <p className="text-center !text-white">
                        {item.name.substring(0, 20)}
                      </p>
                      <p className="text-center !text-yellow-600 text-lg">
                        $ <span>{Number(item.price).toFixed(2)}</span>
                      </p>
                    </div>
                    <NavLink to={`/app/${item._id}`}>
                      <button
                      type="button"
                      className="bg-black/50 rounded-full px-6 py-1.5"
                    >
                      More Info
                    </button>
                    </NavLink>
                   
                  </div>
                  <img
                    className="rounded-md w-full h-64"
                    src={item.image}
                    alt=""
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
