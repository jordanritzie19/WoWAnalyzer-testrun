import Entities from './Entities';
import Combatant from '../Combatant';

class Combatants extends Entities {
  priority = 100;
  players = {};
  get playerCount() {
    return Object.keys(this.players).length;
  }
  getEntities() {
    return this.players;
  }
  getEntity(event) {
    const targetId = event.targetID;
    const combatant = this.players[targetId];
    if (!combatant) {
      return null; // a pet or something probably, either way we don't care.
    }
    return combatant;
  }

  /** @returns Combatant */
  get selected() {
    return this.players[this.owner.playerId];
  }

  on_combatantinfo(event) {
    if (event.error) {
        console.log("Error retrieving combatant information for player with sourceID "+event.sourceID);
        return;
    }

    this.players[event.sourceID] = new Combatant(this.owner, event);

    event.auras.forEach(aura => {
      this.applyBuff({
        ability: {
          abilityIcon: aura.icon,
          guid: aura.ability,
        },
        sourceID: aura.source,
        targetID: event.sourceID,
        timestamp: event.timestamp,
      });
    });
  }
}

export default Combatants;
