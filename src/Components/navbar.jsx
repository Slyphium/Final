import { useState } from "react";

const Navbar = () => {
  let [exercisequery, setexercisequery] = useState("");
  let [gender, setgender] = useState("");
  let [weight_kg, setweight] = useState("");
  let [height_cm, setheight] = useState("");
  let [age, setage] = useState("");
  let [foodquery, setfoodquery] = useState("");

  const [exerciseApiData, setExerciseApiData] = useState([]);
  const [foodApiData, setFoodApiData] = useState([]);

  const totalExerciseCalories = exerciseApiData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.nf_calories,
    0
  );
  const totalFoodCalories = foodApiData.reduce(
    // Whatever the property is for 'amount of calories in a food', replace
    // nf_calories with that name
    (accumulator, currentValue) => accumulator + currentValue.nf_calories,
    0
  );

  const handleGenderChange = (event) => {
    setgender(event.target.value);
  };

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiId = import.meta.env.VITE_API_ID;

  // exercise handle submit //
  function handleSubmit(e) {
    e.preventDefault();
    const exercisedata = {
      query: exercisequery,
    };
    if (gender) exercisedata.gender = gender;
    if (weight_kg) exercisedata.weight_kg = weight_kg;
    if (height_cm) exercisedata.height_cm = height_cm;
    if (age) exercisedata.age = age;

    fetch("https://trackapi.nutritionix.com/v2/natural/exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": import.meta.env.VITE_API_ID,
        "x-app-key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(exercisedata),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.exercises);
        setExerciseApiData(data.exercises);
      });

    // if there is text inside of foodquery, run the handleFoodSubmit() method
    if (foodquery.trim().length > 0) {
      handlefoodSubmit();
    }
  }

  function handlefoodSubmit() {
    const fooddata = {
      query: foodquery,
    };
    fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "4240b60e",
        "x-app-key": "fc615c92f0c108a5d1f317422308af40",
      },
      body: JSON.stringify(fooddata),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFoodApiData(data.foods);
      });
  }
  const fooddata = {
    foodquery: foodquery,
  };

  /* fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      "x-app-id": "4240b60e",
      "x-app-key": "fc615c92f0c108a5d1f317422308af40",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fooddata),
  }).then((response) => console.log(response)); */

  return (
    <div className="p-3 mb-2 bg-info-subtle text-emphasis-info">
      <>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h5>Health and Fitness Tracker</h5>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="row d-flex flex-row justify-content-center">
                  <div className="col-md-6">
                    <div>
                      <label htmlFor="activity">
                        Activities, Exercises, etc
                      </label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="ex: ran 3 miles"
                        id="activity"
                        value={exercisequery}
                        onChange={(e) => setexercisequery(e.target.value)}
                      />
                    </div>
                    <div className="col-sm-4">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="male"
                          name="options"
                          value="male"
                          checked={gender === "male"}
                          onChange={handleGenderChange}
                        />
                        <label className="form-check-label" htmlFor="option1">
                          Male
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="female"
                          name="options"
                          value="female"
                          checked={gender === "female"}
                          onChange={handleGenderChange}
                        />
                        <label className="form-check-label" htmlFor="option2">
                          Female
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="weight-form-group">
                        <label htmlFor="weight_kg">Weight</label>
                        <input
                          type="number"
                          className="weight input"
                          placeholder="Enter weight in kilograms"
                          value={weight_kg}
                          onChange={(e) => setweight(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="height-form-group">
                        <label htmlFor="height_cm">Height</label>
                        <input
                          type="number"
                          className="height input"
                          placeholder="Enter height in centimeters"
                          value={height_cm}
                          onChange={(e) => setheight(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="age-form-group">
                        <label htmlFor="age">Age</label>
                        <input
                          type="number"
                          className="age input"
                          placeholder="Enter age in years"
                          value={age}
                          onChange={(e) => setage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="food">Food Log</label>
                    <input
                      type="text"
                      className="form-control"
                      id="food"
                      placeholder="ex: I had half a burger with a slice of cheddar cheese with a half serving of yogurt"
                      value={foodquery}
                      onChange={(e) => setfoodquery(e.target.value)}
                    />
                    <div className="row">
                      <p className="fs-2 text-center">Results:</p>
                      <div>
                        {exerciseApiData.length !== 0 ? (
                          [
                            ...exerciseApiData.map((exercise) => {
                              console.log(exercise);
                              return (
                                <p key={exercise.tag_id}>
                                  Your {exercise.duration_min} minutes of{" "}
                                  {exercise.name} burned {exercise.nf_calories}{" "}
                                  calories
                                </p>
                              );
                            }),
                            ...foodApiData.map((food) => {
                              console.log(food);
                              return (
                                <p key={food.tags.tag_id}>
                                  The {food.serving_qty} serving(s) of{" "}
                                  {food.tags.item} was {food.nf_calories}{" "}
                                  calories
                                </p>
                              );
                            }),
                          ]
                        ) : (
                          <div>
                            <iframe
                              src="https://giphy.com/embed/Tb4otmP2uH2KQUB77H"
                              width="480"
                              height="480"
                              frameBorder="0"
                              className="giphy-embed"
                              allowFullScreen
                            ></iframe>
                            <p>
                              <a href="https://giphy.com/gifs/math-calculating-bigycomic-Tb4otmP2uH2KQUB77H"></a>
                            </p>
                          </div>
                        )}
                        {exerciseApiData.length !== 0 && (
                          <p>Total Calories Burned: {totalExerciseCalories}</p>
                        )}
                        {foodApiData.length !== 0 && (
                          <p>Total Calories Eaten: {totalFoodCalories}</p>
                        )}
                        {foodApiData.length !== 0 && (
                          <p>
                            Net Calories:{" "}
                            {totalFoodCalories - totalExerciseCalories}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer justify-content-center">
                <button className="btn btn-success" type="submit">
                  {" "}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div></div>
      </>
    </div>
  );
};
export default Navbar;
