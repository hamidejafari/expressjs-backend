function capitalize_first_letter(string, splitBy) {
  const newString = string.split(splitBy);

  const newArray = [];

  if (Array.isArray(newString)) {
    newString.forEach((element, index) => {
      if (element.trim() || index === newString.length - 1) {
        newArray.push(
          element.trim().charAt(0).toUpperCase() + element.trim().slice(1)
        );
      }
    });
  }

  return newArray.join(splitBy);
}

module.exports = capitalize_first_letter;
