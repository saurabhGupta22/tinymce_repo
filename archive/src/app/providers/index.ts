import { InternalStateService } from './internal-state/internal-state.service';
import { SharedService } from './shared/shared.service';
import { DecisionMappingLogic } from './decision-tree/decision-mapping-logic';


export const PROVIDERS = [InternalStateService, SharedService, DecisionMappingLogic];
