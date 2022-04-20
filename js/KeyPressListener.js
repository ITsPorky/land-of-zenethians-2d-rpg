class KeyPressListener {
  constructor(keyCode, callback) {
    let keySafe = true;
    this.keyDownFunction = function (event) {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    };
    this.keyUpFunction = function (event) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };

    document.addEventListener("keydown", this.keyDownFunction);
    document.addEventListener("keyup", this.keyUpFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keyDownFunction);
    document.removeEventListener("keyup", this.keyUpFunction);
  }
}
