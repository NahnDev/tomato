import { Story } from '../planning/schemas/story.schema';

export default class OnVotingChanged {
  static readonly event = 'voting:changed';
  constructor(
    public readonly key: string,
    public readonly payload: Story,
  ) {}
}
