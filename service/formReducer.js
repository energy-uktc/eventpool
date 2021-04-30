
export const FORM_UPDATE = "UPDATE";

export const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedInputValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
    }

    return {
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid: updatedFormIsValid
    };
  } else {
    return state;
  }
};