const getHospitalsBedAvailable = (totalHospitalBeds) => totalHospitalBeds * 0.15;

const getNumberOfDays = (timeToElapse) => {

};
const getPowerNumber = (periodType, timeToElapse) => {
  let numBerOfDays = 0;
  if (periodType === 'days') {
    numBerOfDays = timeToElapse;
  } else if (periodType === 'weeks') {
    numBerOfDays = timeToElapse * 7;
  } else if (periodType === 'months') {
    numBerOfDays = timeToElapse * 30;
  }

  return Math.trunc(numBerOfDays / 3);
};


const covid19ImpactEstimator = (data) => {
  // recuperation des entrance data
  // declaration of input variables
  const [inputs] = { data };
  const {
    region, periodType, timeToElapse, reportedCases, population,
    totalHospitalBeds
  } = inputs;

  // data output variables elements declariations
  const impact = {};

  const severeImpact = {};

  const output = {
    inputs,
    impact,
    severeImpact
  };

  // estimation of currently infected people
  impact.currentlyInfected = reportedCases * 10;

  severeImpact.currentlyInfected = reportedCases * 50;

  // estimation over a period (period type convert to days if not)
  impact.infectionsByRequestedTime = impact.currentlyInfected
                                    * 2 ** getPowerNumber(periodType, timeToElapse);

  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected
                                           * 2 ** getPowerNumber(periodType, timeToElapse);

  // people who need hospitalization to recover their health
  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.15);

  severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime
                                                        * 0.15);

  // beds consumption
  impact.hospitalBedsByRequestedTime = getHospitalsBedAvailable(totalHospitalBeds)
                                       - impact.severeCasesByRequestedTime;

  severeImpact.hospitalBedsByRequestedTime = getHospitalsBedAvailable(totalHospitalBeds)
                                             - severeImpact.severeCasesByRequestedTime;

  // number of positive cases that require ICU CARE
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;

  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

  // number of positive cases that require ventilators
  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);

  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    severeImpact.infectionsByRequestedTime * 0.02
  );

  // estimation of what covid-19 can make economy lost dayly
  impact.dollarsInflight = Math.trunc((impact.infectionsByRequestedTime
                                       * region.avgDailyIncomeInUSD
                                       * region.avgDailyIncomePopulation)
                                       / getNumberOfDays(timeToElapse));

  severeImpact.dollarsInflight = Math.trunc((severeImpact.infectionsByRequestedTime
                * region.avgDailyIncomeInUSD
                * region.avgDailyIncomePopulation)
                / getNumberOfDays(timeToElapse));


  return output;
};


export default covid19ImpactEstimator;
