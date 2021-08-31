export const FORM_UPDATE = "UPDATE";
export const REMOVE_KEY = "REMOVE_KEY";

export const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedInputValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
    }

    return {
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid: updatedFormIsValid,
    };
  } else if (action.type === REMOVE_KEY) {
    const updatedInputValues = {
      ...state.inputValues,
    };
    const updatedInputValidities = {
      ...state.inputValidities,
    };
    delete updatedInputValues[action.key];
    delete updatedInputValidities[action.key];

    let updatedFormIsValid = true;
    for (const key in updatedInputValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
    }

    return {
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid: updatedFormIsValid,
    };
  } else {
    return state;
  }
};
