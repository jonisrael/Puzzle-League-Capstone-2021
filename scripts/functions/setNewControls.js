export function setNewControls(controls) {
  // if controls are given, set them.
  // localStorage.removeItem("controls");
  if (controls) {
    console.log("controls are already set.", localStorage.getItem("controls"));
    // localStorage.setItem("controls", JSON.stringify(controls));
    return controls;
  }
  // otherwise, set controls to default and return the object
  console.log("need new controls");
  const defaultControls = {
    keyboard: {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      swap: "s",
      raise: "r"
    },
    gamepad: {
      up: "",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      swap: "s",
      raise: "r"
    }
  };
  localStorage.setItem("controls", JSON.stringify(defaultControls));
  return defaultControls;
}
