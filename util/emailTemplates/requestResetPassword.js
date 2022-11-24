const requestResetPassword = (firstname, lastname, resetPasswordRoute) => {
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
        You have requested to reset your password! You are almost there. Confirm the request was made by you by clicking on the button below
      </p>

      <a
        href="${resetPasswordRoute}"
        class="btn"
        style="
          color: white;
          background-color: rgb(27, 73, 13);
          text-decoration: none;
          padding: 10px;
          margin-bottom: 1rem;
          display: inline-block;
        "
        >Reset password</a
      >

      <p>
        If you have problem clicking on the button, copy and paste the url below
        into your web browser.
      </p>

      <p>
        <a href="${resetPasswordRoute}"
          >${resetPasswordRoute}</a
        >
      </p>
    </div>
   `;
};

export default requestResetPassword;
