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

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
  const source = uploadAudioPlay.querySelector("source");
  uploadAudioInput.addEventListener("change", () => {
    const file = uploadAudioInput.files[0];
    if (file) {
      source.src = URL.createObjectURL(file);
      uploadAudioPlay.load();
    }
  })
}
// End Upload Audio
//Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const roles = [];

    const listElementRoleId = tablePermissions.querySelectorAll("[role-id]");
    for (const element of listElementRoleId) {
      const roleId = element.getAttribute("role-id");
      const role = {
        id: roleId,
        permissions: []
      };

      const listInputChecked = tablePermissions.querySelectorAll(`input[data-id="${roleId}"]:checked`);

      listInputChecked.forEach(input => {
        const dataName = input.getAttribute("data-name");
        role.permissions.push(dataName);
      });

      roles.push(role);
    }

    const path = buttonSubmit.getAttribute("button-submit");

    fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roles)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
  });
}
//Hết Phân quyền 
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