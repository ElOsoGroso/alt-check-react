const HiScores = ({ hiscores,username}) => {
    return (
      <div>
      <div className ="RSN_HISCORE_CONTAIN">
        {hiscores !== 404 ?
        <div className = "hiscores">         
        <div className ="statdiv1">
        <p className="stat">{hiscores.attack.level}</p>
        <p className="stat">{hiscores.strength.level}</p>
        <p className="stat">{hiscores.defence.level}</p>
        <p className="stat">{hiscores.ranged.level}</p>
        <p className="stat">{hiscores.prayer.level}</p>
        <p className="stat">{hiscores.magic.level}</p>
        <p className="stat">{hiscores.runecraft.level}</p>
        <p className="stat">{hiscores.construction.level}</p>
        </div>
        <div className ="statdiv2">
        <p className="stat">{hiscores.hitpoints.level}</p>
        <p className="stat">{hiscores.agility.level}</p>
        <p className="stat">{hiscores.herblore.level}</p>
        <p className="stat">{hiscores.thieving.level}</p>
        <p className="stat">{hiscores.crafting.level}</p>
        <p className="stat">{hiscores.fletching.level}</p>
        <p className="stat">{hiscores.slayer.level}</p>
        <p className="stat">{hiscores.hunter.level}</p>
        </div>
        <div className ="statdiv3">
        <p className="stat">{hiscores.mining.level}</p>
        <p className="stat">{hiscores.smithing.level}</p>
        <p className="stat">{hiscores.fishing.level}</p>
        <p className="stat">{hiscores.cooking.level}</p>
        <p className="stat">{hiscores.firemaking.level}</p>
        <p className="stat">{hiscores.woodcutting.level}</p>
        <p className="stat">{hiscores.farming.level}</p>
        <p className="totallabel">Total:</p>
        <p className="stattotal">{hiscores.overall.level}</p>
        </div>

      </div> :
      <div className = "hiscores">         
      <div className ="statdiv1">
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      </div>
      <div className ="statdiv2">
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      </div>
      <div className ="statdiv3">
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="stat">0</p>
      <p className="totallabel">Total:</p>
      <p className="stattotal">0</p>
      </div>
      </div>
      
      }

      </div>
            <p className="username">{username}</p>
            </div>

    );
  };

  export default HiScores