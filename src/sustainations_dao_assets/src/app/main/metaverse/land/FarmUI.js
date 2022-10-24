
const UIFarm = () => {
    return (
        <>
            <ul style={{zIndex: 10000, position: "fixed", width: "100vw", margin: "2vh", top: "20px"}}>
                <li>
                    <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm object-27.png"></img>
                </li>
                <li>
                    <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm object-28.png"></img>
                </li>
                <li>
                    <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm object-29.png"></img>
                </li>
                <li>
                    <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm object-30.png"></img>
                </li>
                <li>
                    <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm object-31.png"></img>
                </li>
            </ul>
            <div className="navBar">
                <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm object-32.png"></img>
            </div>
            <div className="messengerBox">
                <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/email.png"></img>
            </div>
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
                    src="/metaverse/farm/Sustaination_farm/farm-object/PNG/farm object_icon ca chua.png"
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

export default UIFarm; 