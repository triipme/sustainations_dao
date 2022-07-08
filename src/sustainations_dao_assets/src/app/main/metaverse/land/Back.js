const Back = () => {
  return (
    <div
      style={{
        position: "fixed",
        right: 35,
        top: 20,
        zIndex: 10000,
      }}
    >
      <img
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.replace("/metaverse");
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
