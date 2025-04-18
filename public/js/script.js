// APlayer
const aplayer = document.getElementById('aplayer');
if (aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);

  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics
      }
    ],
    autoplay: true
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");
  // const avatar2 = document.querySelector(".aplayer .aplayer-pic");

  let timeOutListen;



  ap.on('play', function () {
    avatar.style.animationPlayState = "running";
    // avatar2.style.animationPlayState = "running";
  });

  ap.on('canplay', function () {
    timeOutListen = ap.audio.duration * 4 / 5 * 1000;
  });
  setTimeout(() => {
    setTimeout(() => {
      ap.on('ended', function () {
        fetch(`/songs/listen/${dataSong._id}`)
          .then(res => res.json())
          .then(data => {
            if (data.code == 200) {
              const innerNumberListen = document.querySelector(".singer-detail .inner-listen .inner-number");
              innerNumberListen.innerHTML = data.listen;
            }
          })
      });
    }, timeOutListen);
  }, 1000);


  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused";
  });
}
// End APlayer

// Like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const id = buttonLike.getAttribute("button-like");
    const type = buttonLike.classList.contains("active") ? "dislike" : "like";
    const data = {
      id: id,
      type: type
    };
    fetch("/songs/like", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) {
          // Nếu phản hồi không thành công, ném lỗi  

          return res.json().then(data => {
            throw new Error(data.message); // Ném ra thông báo lỗi  
          });
        }
        return res.json();
      })
      .then(data => {
        if (data.code == 200) {
          if (data.status == "add") {
            buttonLike.classList.add("active");
          } else {
            buttonLike.classList.remove("active");
          }
          const innerNumber = buttonLike.querySelector(".inner-number");
          innerNumber.innerHTML = data.updateLike;
        }
      })
      .catch(error => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.message,
          showConfirmButton: false,
          timer: 1000
        });
      });
  })

}
// End Like

// Favorite
const listbuttonFavorite = document.querySelectorAll("[button-favorite]");
if (listbuttonFavorite.length > 0) {
  listbuttonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const id = buttonFavorite.getAttribute("button-favorite");
      fetch("/songs/favorite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id
        })
      })
        .then(res => {
          if (!res.ok) {
            // Nếu phản hồi không thành công, ném lỗi  

            return res.json().then(data => {
              throw new Error(data.message); // Ném ra thông báo lỗi  
            });
          }
          return res.json();
        })
        .then(data => {
          if (data.code == 200) {
            if (data.status == "add") {
              buttonFavorite.classList.add("active")
            } else {
              buttonFavorite.classList.remove("active");
            }
          }
        })
        .catch(error => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: error.message,
            showConfirmButton: false,
            timer: 700
          });
        });
    })
  })
}

// End Favorite

// Box gợi ý tìm kiếm
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const inputSearch = boxSearch.querySelector(`input[name="keyword"]`);
  inputSearch.addEventListener("keyup", () => {
    const keyword = inputSearch.value;
    fetch(`/songs/search/suggest?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          const htmlSong = data.songs.map(item => `
            <a class="inner-item" href="/songs/detail/${item.slug}">
              <div class="inner-image">
                <img src="${item.avatar}">
              </div>
              <div class="inner-info">
                <div class="inner-title">${item.title}</div>
                <div class="inner-singer">
                  <i class="fa-solid fa-microphone-lines"></i> ${item.singerFullName}
                </div>
              </div>
            </a>
          `);
          const elementInnerSuggest = boxSearch.querySelector(".inner-suggest");
          const elementInnerList = elementInnerSuggest.querySelector(".inner-list");
          elementInnerList.innerHTML = htmlSong.join(""); // Kết hợp mảng html thành 1 chuỗi và thêm nó vào elementInnerList
          if (data.songs.length > 0) {
            elementInnerSuggest.classList.add("show");
          }
          else {
            elementInnerSuggest.classList.remove("show");
          }
        }
      })
  })
}

// Lấy các phần tử liên quan đến việc hiện/ẩn mật khẩu  
const togglePasswordVisibility = document.querySelector("[togglePassword]"); // Nut hoặc biểu tượng để hiện/ẩn mật khẩu 
const togglePasswordVisibilityConfirm = document.querySelector("[togglePasswordConfirm]"); // Nut hoặc biểu tượng để hiện/ẩn mật khẩu 
const passwordInput = document.querySelector("input[name='password']"); // Input cho mật khẩu 
const confirmPasswordInput = document.querySelector("input[name='confirmpassword']");

if (togglePasswordVisibility && passwordInput) {
  togglePasswordVisibility.addEventListener("click", () => {
    let newType = "";
    const type = passwordInput.getAttribute("type");
    if (type === "password") {
      newType = "text";
    } else {
      newType = "password";
    }
    passwordInput.setAttribute("type", newType);

    // Thay đổi biểu tượng nếu cần (giả sử bạn có hai biểu tượng khác nhau cho hiện và ẩn)  
    if (newType === "password") {
      togglePasswordVisibility.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
    } else {
      togglePasswordVisibility.innerHTML = `<i class="fa-solid fa-eye"></i>`
    }
  });
}
if (togglePasswordVisibilityConfirm && confirmPasswordInput) {
  togglePasswordVisibilityConfirm.addEventListener("click", () => {
    let newType = "";
    const type = confirmPasswordInput.getAttribute("type");
    if (type === "password") {
      newType = "text";
    } else {
      newType = "password";
    }
    confirmPasswordInput.setAttribute("type", newType);

    if (newType === "password") {
      togglePasswordVisibilityConfirm.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
    } else {
      togglePasswordVisibilityConfirm.innerHTML = `<i class="fa-solid fa-eye"></i>`
    }
  });
}
//  End Lấy các phần tử liên quan đến việc hiện/ẩn mật khẩu

// show-alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  console.log("chay vao day");
  let time = showAlert.getAttribute("show-alert") || 3000;
  console.log(time);
  time = parseInt(time);
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert
//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
}
// End Upload Image