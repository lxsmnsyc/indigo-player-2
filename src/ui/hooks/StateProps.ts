import createModel from '@lxsmnsyc/react-scoped-model';
import { InstanceInterface } from '../..';
import { StateInterface } from '../../extensions/StateExtension/StateExtension';
import EventEmitter from '../../utils/event-emitter';

export interface StateStoreProps {
  instance: InstanceInterface;
  player: StateInterface;
  emitter: EventEmitter;
}

const StateProps = createModel<StateStoreProps, StateStoreProps>((p) => p);

export default StateProps;
