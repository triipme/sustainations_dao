const Footer = () => {
  return (
    <div
      style={{
        position: "fixed",
        padding: "10px 20px",
        backgroundColor: "rgba(0,0,0,.6)",
        bottom: "20px",

        zIndex: 10000,
        // borderTopRightRadius: 5,
        // borderBottomRightRadius: 5,

        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div className="d-flex">
        <div
          className="d-flex align-items-center"
          style={{
            marginRight: 25,
          }}
        >
          <div
            className="item"
            style={{
              backgroundColor: "#002E5E",
            }}
          ></div>
          <span
            style={{
              color: "#fff",
              marginLeft: 10,
            }}
          >
            Available
          </span>
        </div>

        <div
          className="d-flex align-items-center"
          style={{
            marginRight: 25,
          }}
        >
          <div
            className="item"
            style={{
              backgroundColor: "#48c3c8",
            }}
          ></div>
          <span
            style={{
              color: "#fff",
              marginLeft: 10,
            }}
          >
            Purchased
          </span>
        </div>

        <div
          className="d-flex align-items-center"
          style={{
            marginRight: 25,
          }}
        >
          <div
            className="item"
            style={{
              backgroundColor: "#FAA61A",
            }}
          ></div>
          <span
            style={{
              color: "#fff",
              marginLeft: 10,
            }}
          >
            Premium
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
