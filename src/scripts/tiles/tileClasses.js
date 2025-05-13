import CasinoTile from './CasinoTile.js';
import ChanceTile from './ChanceTile.js';
import CommunityTile from './CommunityTile.js';
import GoToJailTile from './GoToJailTile.js';
import JailTile from './JailTile.js';
import PropertyTile from './PropertyTile.js';
import RailroadTile from './RailroadTile.js';
import TaxTile from './TaxTile.js';
import UtilityTile from './UtilityTile.js';
import StartTile from './StartTile.js';

export const tileClasses = {
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
