const updateResetPassword = (firstname, lastname) => {
  return `
   <div
      class="container"
      style="
        padding: 1rem;
        width: 90%;
        max-width: 500px;
        font-size: 14px;
        line-height: 1.4;
      "
    >
      <h2 style="color: rgb(27, 73, 13); padding-bottom: 1rem">Hello</h2>

      <p>${firstname} ${lastname}<p>

      <p style="padding-bottom: 1rem">
        You have successfully updated your password.
      </p>

      

     
    </div>
   `;
};

export default updateResetPassword;
