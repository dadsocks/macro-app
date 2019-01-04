
const activityFactor = (activity) => {
  if(activity === 1) {
    return 1.2;
  }else if(activity === 2) {
    return 1.35;
  }else if(activity === 3) {
    return 1.5;
  }else if(activity === 4) {
    return 1.75;
  }else {
    return 1.95;
  };
};

const goalAdjustment = (goal) => {
  if(goal === "Cut 1") {
    return -500;
  }else if(goal === "Cut 2") {
    return -750;
  }else if(goal === "Cut 3") {
    return -1000;
  }else if(goal === "Maintain") {
    return 0;
  }else if(goal === "Gain 1") {
    return 500;
  }else if(goal === "Gain 2") {
    return 750;
  }else {
    return 1000;
  };
};

const msjEquation = ({sexFactor,height,weight,age,activity,goal}) => {
  const bmr = 10*weight+6.25*height-5*age+sexFactor;
  const calories = (bmr*activity)+goal;

  return calories;
};

const kamcEquation = ({leanMass,activity,goal}) => {

  const bmr = 370 + (21.6 * leanMass);
  const calories = (bmr * activity) + goal;

  return calories;
};

const calculateCalories = ({height, weight, age, bodyFatPercentage, sexFactor, activity, goal, leanMass}) => {

  let calories;

  if (bodyFatPercentage === 0) {
    calories = msjEquation({sexFactor, height, weight, age, activity, goal});
  } else {
    calories = (msjEquation({sexFactor, height, weight, age, activity, goal}) + kamcEquation({leanMass,activity,goal}))/2;
  }

  return Math.round(calories);
};

const convertToMetricValue = (value, constant) => value * constant;

const calculateTargetMass = ({weight, bodyFatPercentage}) => {
  const leanBodyMass = weight - (weight * bodyFatPercentage);
  const targetMass = (leanBodyMass * .12) + leanBodyMass;

  return targetMass;
};

const calculateSexFactor = (sex) => {
  if (sex === "Male") {
    return 5;
  }

  return -161;
};

const calculateCarbohydrates = (calories) => Math.round((calories * .4)/4);
const calculateProtein = (calories) => Math.round((calories * .3)/4);
const calculateFat = (calories) => Math.round((calories * .3)/9);

const calculateMacros = ({heightInput, weightInput, age, bodyFatPercentageInput, sex, activityInput, goalInput}) => {

  const height = convertToMetricValue(heightInput, 2.54);
  const weight = convertToMetricValue(weightInput, 0.45359237);
  const bodyFatPercentage = bodyFatPercentageInput/100;
  const activity = activityFactor(activityInput);
  const goal = goalAdjustment(goalInput);
  const leanMass = calculateTargetMass({weight, bodyFatPercentage});
  const sexFactor = calculateSexFactor(sex);
  const calories = calculateCalories({height, weight, age, bodyFatPercentage, sexFactor, activity, goal, leanMass});


  const carbohydrates = calculateCarbohydrates(calories);
  const protein = calculateProtein(calories);
  const fat = calculateFat(calories);

  return {
    calories,
    carbohydrates,
    protein,
    fat
  };
};

module.exports = {calculateMacros};
