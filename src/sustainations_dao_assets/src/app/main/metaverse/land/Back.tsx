const Back = () => {
  return (
    <div
      style={{
        position: "fixed",
        right: 90,
        top: 20,
        zIndex: 10000,
      }}
    >
      <img
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.replace("/");
        }}
        width={70}
        height={40}
        src="metaverse/UI_back.png"
        alt=""
      />
    </div>
  );
};

export default Back;
