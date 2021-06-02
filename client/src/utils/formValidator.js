export const addRoomFormValidated = (roomName) => {
  // Reset errors messages
  let errors = [];
  const minRoomNameLength = 5;
  const maxRoomNameLength = 50;
  let isFormCorrect = true;
  let input = roomName;

  if (input.length < minRoomNameLength || input.length > maxRoomNameLength) {
    isFormCorrect = false;
    errors.push(
      "Input length invalid must be (" +
        minRoomNameLength +
        ", " +
        maxRoomNameLength +
        ")"
    );
  }

  if (input === false || !input) {
    isFormCorrect = false;
    errors.push("Something went wrong!");
  }

  if (/^[a-zA-Z\s]*$/g.test(input) === false) {
    isFormCorrect = false;
    errors.push("Room name: only letters allowed [a-zA-Z\\s]");
  }

  return [isFormCorrect, errors];
};

export const setUsernameFormValidated = (username) => {
  // Reset errors messages
  let errors = [];
  const minUsernameLength = 3;
  const maxUsernameLength = 20;
  let isFormCorrect = true;
  let input = username;

  if (input.length < minUsernameLength || input.length > maxUsernameLength) {
    isFormCorrect = false;
    errors.push(
      "Input length invalid must be (" +
        minUsernameLength +
        ", " +
        maxUsernameLength +
        ")"
    );
  }

  if (input === false || !input) {
    isFormCorrect = false;
    errors.push("Something went wrong!");
  }

  if (/^[a-zA-Z0-9\s]*$/g.test(input) === false) {
    isFormCorrect = false;
    errors.push("Only letters and numbers allowed [a-zA-Z0-9\\s]");
  }

  return [isFormCorrect, errors];
};

export const chatMsgFormValidated = (msg) => {
  const input = msg;
  const minMsgLength = 1;
  const maxMsgLength = 370;
  let isFormCorrect = true;

  if (input.length < minMsgLength || input.length > maxMsgLength) {
    isFormCorrect = false;
  }

  if (input === false || !input) {
    isFormCorrect = false;
  }

  return isFormCorrect;
};
