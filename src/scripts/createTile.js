import BaseTile from './tiles/baseTile.js';
import CasinoTile from './tiles/casinoTile.js';
import ChanceTile from './tiles/chanceTile.js';
import CommunityTile from './tiles/communityTile.js';
import GoToJailTile from './tiles/goToJailTile.js';
import JailTile from './tiles/jailTile.js';
import PropertyTile from './tiles/propertyTile.js';
import RailroadTile from './tiles/railroadTile.js';
import TaxTile from './tiles/taxTile.js';
import UtilityTile from './tiles/utilityTile.js';
import StartTile from './tiles/startTile.js';

export function createTile(tile) {
  const constructors = {
    property: PropertyTile,
    railroad: RailroadTile,
    utility: UtilityTile,
    tax: TaxTile,
    chance: ChanceTile,
    community: CommunityTile,
    jail: JailTile,
    gotojail: GoToJailTile,
    casino: CasinoTile,
    start: StartTile,
  };

  const TileClass = constructors[tile.type] || BaseTile;
  return new TileClass(tile);
}
