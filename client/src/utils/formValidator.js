export const addRoomFormValidated = (roomName) => {
  // Reset errors messages
  let errors = [];
  const minRoomNameLength = 5;
  let correctForm = true;
  let input = roomName;

  if (input.length < minRoomNameLength) {
    correctForm = false;
    errors.push("Room name length must be > " + minRoomNameLength);
  }

  if (input === false || !input) {
    correctForm = false;
    errors.push("Something went wrong!");
  }

  if (/^[a-zA-Z\s]*$/g.test(input) === false) {
    correctForm = false;
    errors.push("Room name: only letters allowed [a-zA-Z\\s]");
  }

  return [correctForm, errors];
};
