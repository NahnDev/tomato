import { Planning } from '../planning/schemas/planning.schema';
import EmitableEvent from './EmitableEvent';

export default class OnPlanningUsersChanged implements EmitableEvent {
  readonly event = 'planning/user:changed';
  constructor(
    public readonly key: string,
    public readonly payload: Planning['users'],
  ) {}
}
