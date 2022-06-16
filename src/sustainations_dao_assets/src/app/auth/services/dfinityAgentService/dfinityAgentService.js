import FuseUtils from '@fuse/utils/FuseUtils';

/* eslint-disable camelcase */

class DfinityAgentService extends FuseUtils.EventEmitter {
  login = () => {
    this.emit('onLogin', 'Signed in');
  };

  logout = () => {
    this.emit('onLogout', 'Logged out');
  };
}

const instance = new DfinityAgentService();

export default instance;
