import { Planing } from '../planing/schemas/planing.schema';
import EmitableEvent from './EmitableEvent';

export default class OnPlaningUsersChanged implements EmitableEvent {
  readonly event = 'planing/user:changed';
  constructor(
    public readonly key: string,
    public readonly payload: Planing['users'],
  ) {}
}
