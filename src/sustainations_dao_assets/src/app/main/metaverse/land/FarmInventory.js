
export default function Inventory() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          left: "50%",
          zIndex: 10000,
          height: "80px",
          width: "70%",
          backgroundColor: "white",
          transform: 'translateX(-50%)',
          bottom: '44px',

        }}
      >
        <img
          style={{
            cursor: "pointer",
            display: "inline-block",
            margin: "5px"
          }}
          onClick={() => {
            inventory.tomato = !inventory.tomato
            inventory.dig = false
          }
          }
          width={70}
          height={40}
          src="/metaverse/farm/Sustaination_farm/farm-object/PNG/farm-object_iconcachua.png"
          alt=""
        />

        <img
          style={{
            cursor: "pointer",
            display: "inline-block",
            margin: "5px"
          }}
          onClick={() => {
            inventory.tomato = false
            inventory.dig = !inventory.dig
          }
          }
          width={70}
          height={40}
          src="/metaverse/farm/Sustaination_farm/farm-object/PNG/shovel.png"
          alt=""
        />
      </div>
    </>
  )
}
