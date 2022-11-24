const creditUserEmail = (firstname, lastname, type, amount) => {
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
          gap: 10px;
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
      <h2 style="padding-bottom: 1rem">Hello <span style="color: rgb(27, 73, 13);">${firstname} ${lastname}</span></h2>

      <p style="padding-bottom: 1rem">
        Your ${type} account has been credited with NGN ${amount}.00
      </p>

      
    </div>`;
};

export default creditUserEmail;