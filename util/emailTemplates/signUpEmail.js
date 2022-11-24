const signUpEmail = (firstname, lastname, verificationRoute) => {
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
    <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          width: 100%;
        "
      >
        <div>
          <img
            style=" width: 30px;"
            src="https://res.cloudinary.com/dhpswjep4/image/upload/v1634590507/Fundvest/logo_nnlp3v.png"
            alt=""
          />
        </div>
        <div style="font-size: 2rem;">Fundvest</div>
      </div>
      <h2 style="color: rgb(27, 73, 13); padding: 1rem 0">Welcome</h2>

      <p>${firstname} ${lastname}<p>

      <p style="padding-bottom: 1rem">
        Thank you for signing up! You are almost ready. Confirm your email
        address by clicking on the button below
      </p>

      <a
        href="${verificationRoute}"
        class="btn"
        style="
          color: white;
          background-color: rgb(27, 73, 13);
          text-decoration: none;
          padding: 10px;
          margin-bottom: 1rem;
          display: inline-block;
        "
        >Verify your email</a
      >

      <p>
        If you have problem clicking on the button, copy and paste the url below
        into your web browser.
      </p>

      <p>
        <a href="${verificationRoute}"
          >${verificationRoute}</a
        >
      </p>
    </div>
   `;
}

export default signUpEmail;